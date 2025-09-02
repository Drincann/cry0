import { Command } from 'commander';
import { repositories as repos } from '../../../persistence/repository.mjs';
import { printer } from '../../output/index.mjs';
import { ensureCliLevelSecretInitialized } from '../../../env/index.mjs';
import { CliError } from '../../../error/cli-error.mjs';

export const walletRenameCommand = new Command()
  .name('rename')
  .description('Create a new wallet')

  .command('rename <wallet-alias> <new-alias>')

  .action(async (fromWallet, toWallet, opts, cmd) => {
    try {
      await ensureCliLevelSecretInitialized()
      const fromWalletData = await repos.wallet.getWallet(fromWallet)
      const toWalletData = await repos.wallet.getWallet(toWallet)
      if (fromWalletData === undefined) {
        printer.error(`Wallet '${fromWallet}' not found`);
        return;
      }

      if (toWalletData !== undefined) {
        printer.error(`Wallet '${toWallet}' already exists`);
        return;
      }

      if ((await repos.wallet.getAllWallets()).some(wallet => wallet.alias === toWallet)) {
        printer.error(`Wallet with alias '${toWallet}' already exists`);
        return;
      }

      repos.wallet.rename(fromWallet, toWallet);
    } catch (e: unknown) {
      if (e instanceof CliError) {
        printer.error(e.message)
      }
    }
  })


