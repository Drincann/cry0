import { Command } from 'commander';
import { txCommand, walletCommand } from './commands/index.mjs';

export const program = new Command()
  .name('cry0')
  .description('cry0 is a lightweight and simple CLI for managing cold wallets and offline crypto transactions.')
  .version('alpha')

  .addCommand(walletCommand)
  .addCommand(txCommand);
