import type { WalletData } from "./types.mjs";
import { identity, toMap } from "../utils/functional.mjs";
import { Account } from "./account.mjs";
import { Mnemonic } from "./types.mjs";

export class Wallet {
  private mnemonic: Mnemonic
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

  public serialize(): WalletData {
    return {
      alias: this.alias,
      mnemonic: this.mnemonic,
      accounts: [...this.accounts.values()].map(account => account.serialize())
    }
  }
}
