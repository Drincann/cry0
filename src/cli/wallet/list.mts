import { Command } from 'commander';
import { Wallet } from '../../lib/core/wallet.mjs';
import { repositories as repos } from '../../lib/persistence/repository.mjs';
import { logger } from '../logger/index.mjs';
import { thumb } from '../util/cli.mjs';

export const walletListCommand = new Command()
  .name('list')
  .description('List all wallets')

  .action(async (opts, cmd) => {
    const wallets = (await repos.wallet.getAllWallets()).map(Wallet.from);
    if (wallets.length === 0) {
      logger.info('No wallets found');
      return;
    }

    wallets.forEach((wallet, i) => {
      logger.info(`${i}.${wallet.alias} [${thumb(wallet.accounts)}]`);
    });
  })
