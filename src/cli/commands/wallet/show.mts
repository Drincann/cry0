import { Command } from 'commander';
import { Wallet } from '../../../libs/core/wallet.mjs';
import { repositories as repos } from '../../../libs/persistence/repository.mjs';
import { logger } from '../../logger/index.mjs';
import prompts from 'prompts'
import { WalletData, WalletDataWithoutPassphrase } from '../../../libs/core/types.mjs';

export const walletShowCommand = new Command()
  .name('show')
  .description('Show wallet details')

  .command('show <wallet-alias>')
  .option<Set<string>>('-c --chain <chain>', 'Show only addresses for a specific chain', (chain) => new Set(chain.split(',').map(c => c.toUpperCase())), new Set())
  .option('-p --private', 'Show private keys')
  .option('-m --mnemonic', 'Show mnemonic')

  .action(async (walletAlias, opts, cmd) => {
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

      const wallet = Wallet.from(assignPassphrase(walletData, result.value));
      show(wallet, opts);
      return;
    }

    // No passphrase required
    const wallet = Wallet.from(walletData);
    show(wallet, opts);
  })

function show(wallet: Wallet, opts: { chain: Set<string>, private: boolean, mnemonic: boolean }) {
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

function assignPassphrase(walletData: WalletDataWithoutPassphrase, value: string): WalletData {
  return {
    ...walletData,
    mnemonic: {
      ...walletData.mnemonic,
      passphrase: value
    }
  }
}

