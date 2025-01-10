import { Argument, Command } from 'commander';
import { Wallet } from '../../lib/core/wallet.mjs';
import prompts from 'prompts'
import { repositories as repos } from '../../lib/persistence/repository.mjs';
import { logger } from '../logger/index.mjs';
import { thumb } from '../util/cli.mjs';

export const walletRemoveCommand = new Command()
  .name('remove')
  .description('Remove wallet')

  .command('remove <wallet-alias>')
  .option('-y --yes', 'Skip confirmation')

  .action(async (walletAlias, opts, cmd) => {
    const walletData = await repos.wallet.getWallet(walletAlias)
    if (walletData === undefined) {
      logger.error(`Wallet with alias '${walletAlias}' not found`);
      return;
    }

    const wallet = Wallet.from(walletData);
    if (!opts.yes) {
      const answer = await prompts({
        type: 'confirm',
        name: 'value',
        message: `Are you sure you want to remove wallet '${walletAlias}' [${thumb(wallet.accounts)}]?`
      });
      if (!answer) return;
      repos.wallet.remove(walletAlias);
      logger.info(`Wallet '${walletAlias}' removed`);
    }

  })
