import { Command } from 'commander';
import { repositories as repos } from '../../../libs/persistence/repository.mjs';
import { logger } from '../../logger/index.mjs';

export const walletRenameCommand = new Command()
  .name('rename')
  .description('Create a new wallet')

  .command('rename <wallet-alias> <new-alias>')

  .action(async (fromWallet, toWallet, opts, cmd) => {
    const fromWalletData = await repos.wallet.getWallet(fromWallet)
    const toWalletData = await repos.wallet.getWallet(toWallet)
    if (fromWalletData === undefined) {
      logger.error(`Wallet '${fromWallet}' not found`);
      return;
    }

    if (toWalletData !== undefined) {
      logger.error(`Wallet '${toWallet}' already exists`);
      return;
    }

    if ((await repos.wallet.getAllWallets()).some(wallet => wallet.alias === toWallet)) {
      logger.error(`Wallet with alias '${toWallet}' already exists`);
      return;
    }

    repos.wallet.rename(fromWallet, toWallet);
  })


