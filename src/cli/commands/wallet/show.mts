import { Command } from 'commander';
import { Wallet } from '../../../libs/core/wallet.mjs';
import { repositories as repos } from '../../../libs/persistence/repository.mjs';
import { logger } from '../../logger/index.mjs';
import prompts from 'prompts'
import { WalletData, StoredWalletData } from '../../../libs/core/types.mjs';
import { hexSha256 } from '../../../libs/utils/crypto.mjs';
import { ensureCliLevelSecretInitialized } from '../../util/cli.mjs';
import { CliError } from '../../error/index.mjs';

export const walletShowCommand = new Command()
  .name('show')
  .description('Show wallet details')

  .command('show <wallet-alias>')
  .option<Set<string>>('-c --chain <chain>', 'Show only addresses for a specific chain', (chain) => new Set(chain.split(',').map(c => c.toUpperCase())), new Set())
  .option('-p --private', 'Show private keys')
  .option('-m --mnemonic', 'Show mnemonic')

  .action(async (walletAlias, opts, cmd) => {
    try {
      await ensureCliLevelSecretInitialized()

      const walletData = await repos.wallet.getWallet(walletAlias);
      if (walletData === undefined) {
        logger.error(`Wallet with alias '${walletAlias}' not found`);
        return;
      }

      if (walletData.mnemonic.hasPassphrase) {
        const result = await prompts({
          type: 'password',
          name: 'value',
          message: 'Enter passphrase for the mnemonic'
        })
        if (typeof result.value !== 'string' || result.value.length === 0) {
          logger.error('Passphrase is required');
          return;
        }

        if (!await hashMatches(walletData.mnemonic.passphraseSha256, result.value)) {
          logger.error('Passphrase is incorrect');
          return;
        }

        const wallet = Wallet.from(assignPassphrase(walletData, result.value));
        show(wallet, opts);
        return;
      }

      // No passphrase required
      const wallet = Wallet.from(walletData);
      show(wallet, opts);
    } catch (e: unknown) {
      if (e instanceof CliError) {
        logger.error(e.message)
      }
    }
  })

export function show(wallet: Wallet, opts: { chain: Set<string>, private: boolean, mnemonic: boolean }) {
  logger.info(`[Alias]: ${wallet.alias}`);
  if (opts.mnemonic) logger.info(`[Mnemonic]: ${wallet.mnemonic.words}`);
  logger.info('[Accounts]:');
  [...wallet.accounts.entries()].forEach(([alias, account], i) => {
    logger.info(`  ${i}.${alias}:`)
    Object.entries(account.addresses).forEach(([network, address]) => {
      if (opts.chain.has(network) || opts.chain.size === 0) {
        logger.info(`    ${network}: <address> ${address.address}`)
        if (opts.private) logger.info(`         <private> ${address.privateKey}`)
      }
    });
  });
}

function assignPassphrase(walletData: StoredWalletData, value: string): WalletData {
  return {
    ...walletData,
    mnemonic: {
      ...walletData.mnemonic,
      passphrase: value
    }
  }
}

async function hashMatches(passphraseSha256: string | undefined, value: string): Promise<boolean> {
  return await hexSha256(value) === passphraseSha256;
}

