import type { WalletData, StoredWalletData } from "./types.mjs";
import { identity, toMap } from "../utils/fp.mjs";
import { Account } from "./account.mjs";
import { Mnemonic } from "./types.mjs";
import { hexSha256 } from "../crypto/hash.mjs";
import prompts from "prompts";
import { CliParameterError } from "../error/cli-error.mjs";
import { printer } from "../cli/output/index.mjs";

export class Wallet {
  public mnemonic: Mnemonic
  public alias: string;
  public accounts: Map<string, Account> // alias -> Account

  constructor(alias: string, mnemonic: Mnemonic, accounts: Account[]) {
    this.alias = alias
    this.mnemonic = mnemonic
    this.accounts = toMap(accounts, account => account.alias, identity())
  }

  public static generateWithDefaultAccount(alias: string, mnemonic: Mnemonic) {
    return new Wallet(alias, mnemonic, [new Account(mnemonic, 0, 'default')])
  }

  public static async from(data: StoredWalletData): Promise<Wallet> {
    const walletData: WalletData = {
      ...data,
      mnemonic: {
        ...data.mnemonic,
        passphrase: undefined
      }
    }

    if (data.mnemonic.hasPassphrase) {
      const result = await prompts({
        type: 'password',
        name: 'value',
        message: 'Enter the wallet "' + data.alias + '" mnemonic passphrase'
      })
      if (typeof result.value !== 'string' || result.value.length === 0) {
        throw new CliParameterError('Passphrase is required');
      }

      if (!await hashMatches(data.mnemonic.passphraseSha256, result.value)) {
        throw new CliParameterError('Passphrase is incorrect');
      }

      walletData.mnemonic.passphrase = result.value
    }

    return new Wallet(
      walletData.alias,
      walletData.mnemonic,
      walletData.accounts.map(accountData => Account.from(walletData.mnemonic, accountData))
    )
  }

  public async serialize(): Promise<StoredWalletData> {
    return {
      alias: this.alias,
      mnemonic: {
        hasPassphrase: isNonEmptyString(this.mnemonic.passphrase),
        passphraseSha256: this.mnemonic.passphrase ? await hexSha256(this.mnemonic.passphrase) : undefined,
        words: this.mnemonic.words,
      },
      accounts: [...this.accounts.values()].map(account => account.serialize())
    }
  }
}

function assignPassphrase(walletData: StoredWalletData, value: string): WalletData {
  return {
    ...walletData,
    mnemonic: {
      ...walletData.mnemonic,
      passphrase: value
    }
  }
}

async function hashMatches(passphraseSha256: string | undefined, value: string): Promise<boolean> {
  return await hexSha256(value) === passphraseSha256;
}

function isNonEmptyString(passphrase: string | undefined): boolean {
  return typeof passphrase === 'string' && passphrase.length > 0;
}

