import { Command } from 'commander';
import { Wallet } from '../../../libs/core/wallet.mjs';
import { repositories as repos } from '../../../libs/persistence/repository.mjs';
import { logger } from '../../logger/index.mjs';

export const walletShowCommand = new Command()
  .name('show')
  .description('Show wallet details')

  .command('show <wallet-alias>')
  .option<Set<string>>('-c --chain <chain>', 'Show only addresses for a specific chain', (chain) => new Set(chain.split(',').map(c => c.toUpperCase())), new Set())
  .option('-p --private', 'Show private keys')

  .action(async (walletAlias, opts, cmd) => {
    const walletData = await repos.wallet.getWallet(walletAlias);
    if (walletData === undefined) {
      logger.error(`Wallet with alias '${walletAlias}' not found`);
      return;
    }

    const wallet = Wallet.from(walletData);
    show(wallet, opts);
  })

function show(wallet: Wallet, opts: { chain: Set<string>, private: boolean }) {
  logger.info(`[Alias]: ${wallet.alias}`);
  logger.info('[Accounts]:');
  [...wallet.accounts.entries()].forEach(([alias, account], i) => {
    logger.info(`  ${i}.${alias}:`);
    Object.entries(account.addresses).forEach(([network, address]) => {
      if (opts.chain.has(network) || opts.chain.size === 0) {
        logger.info(`    ${network}: <address> ${address.address}`)
        if (opts.private) logger.info(`         <private> ${address.privateKey}`)
      }
    });
  });
}
