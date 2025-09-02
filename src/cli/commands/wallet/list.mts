import { Command } from 'commander';
import { Wallet } from '../../../domain/wallet.mjs';
import { repositories as repos } from '../../../persistence/repository.mjs';
import { printer } from '../../output/index.mjs';
import { ensureCliLevelSecretInitialized } from '../../../env/index.mjs';
import { StoredWalletData } from '../../../domain/types.mjs';
import { CliError } from '../../../error/cli-error.mjs';
import { accountSummary } from '../../../utils/display.mjs';

export const walletListCommand = new Command()
  .name('list')
  .description('List all wallets')

  .action(async (opts, cmd) => {
    try {
      await ensureCliLevelSecretInitialized()
      const walletsData = (await repos.wallet.getAllWallets())
      if (walletsData.length === 0) {
        printer.info('No wallets found');
        return;
      }

      for (let i = 0; i < walletsData.length; i++) {
        const walletData = walletsData[i];
        printer.info(`${i}.${walletData.alias} [${await summary(walletData)}]`);
      }
    } catch (e: unknown) {
      if (e instanceof CliError) {
        printer.error(e.message)
      }
    }
  })

async function summary(walletData: StoredWalletData) {
  return walletData.mnemonic.hasPassphrase
    ? 'locked'
    : accountSummary((await Wallet.from(walletData)).accounts);
}
