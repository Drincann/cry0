import type { WalletData, StoredWalletData } from "./types.mjs";
import { identity, toMap } from "../utils/functional.mjs";
import { Account } from "./account.mjs";
import { Mnemonic } from "./types.mjs";
import { hexSha256 } from "../utils/crypto.mjs";

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

  public static from(data: WalletData): Wallet {
    return new Wallet(
      data.alias,
      data.mnemonic,
      data.accounts.map(accountData => Account.from(data.mnemonic, accountData))
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

function isNonEmptyString(passphrase: string | undefined): boolean {
  return typeof passphrase === 'string' && passphrase.length > 0;
}

