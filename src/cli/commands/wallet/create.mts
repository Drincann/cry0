import { Command } from 'commander';
import { repositories as repos } from '../../../libs/persistence/repository.mjs';
import { CliParameterError } from '../../error/index.mjs';
import { logger } from '../../logger/index.mjs';
import * as mnemonicUtil from '../../../libs/core/mnemonic.mjs'
import assert from 'assert';
import { Wallet } from '../../../libs/core/wallet.mjs';
import { show } from './show.mjs';

interface WalletCreateParams {
  alias?: string
  mnemonic?: string
  mnemonicLength: number
  passphrase?: string
  showMnemonic?: boolean
  ephemeral?: boolean
}

export const walletCreateCommand = new Command()
  .name('create')
  .description('Create a new wallet')

  .option('-a --alias <wallet-alias>', 'Alias for the wallet')
  .option('-m --mnemonic <mneomonic> ', 'Create a wallet from a mnemonic')
  .option<number>('-l --mnemonic-length <length> ', 'Length of the mnemonic you want to generate', length => parseInt(length), 12)
  .option('-p --passphrase <passphrase>', 'Passphrase for the mnemonic')
  .option('-s --show-mnemonic', 'Show the mnemonic after creating the wallet', false)
  .option('-e --ephemeral', 'Do not save the wallet, only display in console', false)

  .action(async (opts: WalletCreateParams) => {
    try {
      fix(opts)
      check(opts); assert(isValidMnemonicLength(opts.mnemonicLength))

      const walletName = opts.ephemeral ? 'ephemeral' : opts.alias ?? await generateNextWalletName()
      const mnemonic = {
        words: opts.mnemonic ?? mnemonicUtil.generate(opts.mnemonicLength),
        passphrase: opts.passphrase
      }

      const wallet: Wallet = Wallet.generateWithDefaultAccount(walletName, mnemonic)

      if (opts.showMnemonic) {
        logger.warn('warn: mnemonic is shown in the console, please keep it safe')
        logger.info('Generated mnemonic: ' + mnemonic.words)
      }

      if (opts.ephemeral) {
        logger.info(`Ephemeral wallet created! (not saved)`)
        show(wallet, { chain: new Set(), private: true, mnemonic: true })
        return;
      }

      logger.info(`Wallet '${wallet.alias}' created!`)
      repos.wallet.save(await wallet.serialize())
    } catch (e: unknown) {
      if (e instanceof CliParameterError) {
        logger.error(e.message)
      }
    }
  })

function check(opts: WalletCreateParams) {
  checkWalletAlias(opts.alias)
  checkMnemonic(opts.mnemonic)
  checkMnemonicLengthToGenerate(opts.mnemonicLength)
  // TODO: impl the rest chack
}

async function generateNextWalletName(): Promise<string> {
  const walletsData = await repos.wallet.getAllWallets()

  let nextNameSuffixIndex = 0
  let nextName = 'wallet_' + nextNameSuffixIndex
  while (walletsData.find(wallet => wallet.alias === nextName)) nextName = 'wallet_' + ++nextNameSuffixIndex;

  return nextName
}

function isEmpty(alias: string) {
  return (alias?.length ?? 0) === 0;
}

function isString(alias: string | undefined) {
  return typeof alias === 'string';
}

function containsWhite(alias: string) {
  return alias.search(/\s/) !== -1;
}

function fix(opts: WalletCreateParams) {
  if (typeof opts.alias === 'string') {
    opts.alias = opts.alias.trim()
  }

  if (typeof opts.mnemonic === 'string') {
    opts.mnemonic = ensureSingleWhiteSpace(opts.mnemonic.trim())
  }
}

function ensureSingleWhiteSpace(value: string): string {
  return value.replaceAll(/\s+/g, ' ')
}
function wordsSizeOf(mnemonic: string): number {
  return mnemonic.split(' ').length
}

function notIn(item: number, list: number[]): boolean {
  return !list.includes(item)
}

function checkWalletAlias(alias: string | undefined) {
  if (isString(alias) && isEmpty(alias)) {
    throw new CliParameterError('wallet alias should not be empty if provided')
  }

  if (isString(alias) && containsWhite(alias)) {
    throw new CliParameterError('wallet alias should not contain white spaces, got: \'' + alias + '\'')
  }

  if (isString(alias) && !/^[a-zA-Z0-9_-]+$/.test(alias)) {
    throw new CliParameterError('wallet alias should only contain letters, numbers, underscores and hyphens')
  }
}

function checkMnemonic(mnemonic: string | undefined) {
  if (isString(mnemonic) && notIn(wordsSizeOf(mnemonic), [12, 15, 18, 21, 24])) {
    throw new CliParameterError('mnemonic should be a 12, 15, 18, 21 or 24 words long')
  }
}

function checkMnemonicLengthToGenerate(mnemonicLength: number | undefined) {
  if (isNumber(mnemonicLength) && notIn(mnemonicLength, [12, 15, 18, 21, 24])) {
    throw new CliParameterError('mnemonic length should be 12, 15, 18, 21 or 24')
  }
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}

function isValidMnemonicLength(mnemonicLength: number): mnemonicLength is 12 | 15 | 18 | 21 | 24 {
  return _in(mnemonicLength, [12, 15, 18, 21, 24])
}

function _in(item: number, list: number[]): boolean {
  return !notIn(item, list)
}

