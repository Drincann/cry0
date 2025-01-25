import { Command } from 'commander';
import { Wallet } from '../../../libs/core/wallet.mjs';
import { repositories as repos } from '../../../libs/persistence/repository.mjs';
import { logger } from '../../logger/index.mjs';
import { accountSummary, ensureCliLevelSecretInitialized } from '../../util/cli.mjs';
import { StoredWalletData } from '../../../libs/core/types.mjs';
import { CliError } from '../../error/index.mjs';

export const walletListCommand = new Command()
  .name('list')
  .description('List all wallets')

  .action(async (opts, cmd) => {
    try {
      await ensureCliLevelSecretInitialized()
      const walletsData = (await repos.wallet.getAllWallets())
      if (walletsData.length === 0) {
        logger.info('No wallets found');
        return;
      }

      walletsData.forEach((walletData, i) => {
        logger.info(`${i}.${walletData.alias} [${summary(walletData)}]`);
      });
    } catch (e: unknown) {
      if (e instanceof CliError) {
        logger.error(e.message)
      }
    }
  })

function summary(walletData: StoredWalletData) {
  return walletData.mnemonic.hasPassphrase
    ? 'locked'
    : accountSummary(Wallet.from(walletData).accounts);
}
