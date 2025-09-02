import { Address, createBtcAddress, createEthAddress } from "./address.mjs";
import * as mnemonicUtil from '../crypto/mnemonic.mjs'
import { Mnemonic } from "./types.mjs";
import { AccountData } from "./types.mjs";

export class Account {
  index: number;
  alias: string;
  addresses: { ETH: Address; BTC: Address; };

  constructor(mnemonic: Mnemonic, index: number, alias: string) {
    this.index = index
    this.alias = alias
    this.addresses = Account.createAddress(mnemonic, index, alias)
  }

  private static createAddress(mnemonic: Mnemonic, index: number, alias: string): {
    ETH: Address;
    BTC: Address;
  } {

    const keypairs = mnemonicUtil.derive(mnemonic, index)
    return {
      ETH: createEthAddress(alias, keypairs.ETH.privateKey, keypairs.ETH.publicKey, keypairs.ETH.address),
      BTC: createBtcAddress(alias, keypairs.BTC.privateKey, keypairs.BTC.publicKey, keypairs.BTC.address)
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
