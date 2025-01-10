import { Address, createAddress } from "./address.mjs";
import * as mnemonicUtil from './mnemonic.mjs'
import { Mnemonic } from "./types.mjs";
import { AccountData } from "./types.mjs";

export class Account {
  index: number;
  alias: string;
  addresses: { ETH: Address<'ETH'>; BTC: Address<'BTC'>; };

  constructor(mnemonic: Mnemonic, index: number, alias: string) {
    this.index = index
    this.alias = alias
    this.addresses = Account.createAddress(mnemonic, index, alias)
  }

  private static createAddress(mnemonic: Mnemonic, index: number, alias: string): {
    ETH: Address<'ETH'>;
    BTC: Address<'BTC'>;
  } {

    const keypairs = mnemonicUtil.derive(mnemonic, index)
    return {
      ETH: createAddress('ETH', alias, keypairs.ETH.privateKey, keypairs.ETH.address),
      BTC: createAddress('BTC', alias, keypairs.BTC.privateKey, keypairs.BTC.address)
    }
  }

  public static from(mnemonic: Mnemonic, accountData: AccountData): Account {
    return new Account(mnemonic, accountData.index, accountData.alias)
  }

  public serialize(): AccountData {
    return {
      alias: this.alias,
      index: this.index
    }
  }
}
