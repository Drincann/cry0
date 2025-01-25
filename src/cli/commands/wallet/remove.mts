import { Argument, Command } from 'commander';
import { Wallet } from '../../../libs/core/wallet.mjs';
import prompts from 'prompts'
import { repositories as repos } from '../../../libs/persistence/repository.mjs';
import { logger } from '../../logger/index.mjs';
import { accountSummary, ensureCliLevelSecretInitialized } from '../../util/cli.mjs';
import { CliError } from '../../error/index.mjs';

export const walletRemoveCommand = new Command()
  .name('remove')
  .description('Remove wallet')

  .command('remove <wallet-alias>')
  .option('-y --yes', 'Skip confirmation')

  .action(async (walletAlias, opts, cmd) => {
    try {
      await ensureCliLevelSecretInitialized()
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
          message: `Are you sure you want to remove wallet '${walletAlias}' [${accountSummary(wallet.accounts)}]?`
        });
        if (!answer) return;
        repos.wallet.remove(walletAlias);
        logger.info(`Wallet '${walletAlias}' removed`);
      }
    } catch (e: unknown) {
      if (e instanceof CliError) {
        logger.error(e.message)
      }
    }
  })
