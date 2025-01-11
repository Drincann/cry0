import { Command } from 'commander';
import { Wallet } from '../../../libs/core/wallet.mjs';
import { repositories as repos } from '../../../libs/persistence/repository.mjs';
import { logger } from '../../logger/index.mjs';
import { accountSummary } from '../../util/cli.mjs';
import { WalletDataWithoutPassphrase } from '../../../libs/core/types.mjs';

export const walletListCommand = new Command()
  .name('list')
  .description('List all wallets')

  .action(async (opts, cmd) => {
    const walletsData = (await repos.wallet.getAllWallets())
    if (walletsData.length === 0) {
      logger.info('No wallets found');
      return;
    }

    walletsData.forEach((walletData, i) => {
      logger.info(`${i}.${walletData.alias} [${summary(walletData)}]`);
    });
  })

function summary(walletData: WalletDataWithoutPassphrase) {
  return walletData.mnemonic.hasPassphrase
    ? 'locked'
    : accountSummary(Wallet.from(walletData).accounts);
}
