import { Command } from 'commander';
import { walletCreateCommand } from './wallet/create.mjs';
import { walletRenameCommand } from './wallet/rename.mjs';
import { walletShowCommand } from './wallet/show.mjs';
import { walletListCommand } from './wallet/list.mjs';
import { walletRemoveCommand } from './wallet/remove.mjs';

export const walletCommand = new Command()
  .name('wallet')
  .description('Manage wallets')

  .addCommand(walletCreateCommand)
  .addCommand(walletRenameCommand)
  .addCommand(walletShowCommand)
  .addCommand(walletListCommand)
  .addCommand(walletRemoveCommand)
