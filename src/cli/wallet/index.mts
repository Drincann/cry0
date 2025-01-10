import { Command } from 'commander';
import { walletCreateCommand } from './create.mjs';
import { walletRenameCommand } from './rename.mjs';
import { walletShowCommand } from './show.mjs';
import { walletListCommand } from './list.mjs';
import { walletRemoveCommand } from './remove.mjs';

export const walletCommand = new Command()
  .name('wallet')
  .description('Manage wallets')

  .addCommand(walletCreateCommand)
  .addCommand(walletRenameCommand)
  .addCommand(walletShowCommand)
  .addCommand(walletListCommand)
  .addCommand(walletRemoveCommand)
