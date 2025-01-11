import { Blockchain, Fee } from "./types.mjs"

export interface Address<ChainType extends Blockchain> {
  alias: string
  address: string
  privateKey: string

  sign: (unsignedTx: string) => Promise<string>
  createTx: (to: string, amount: string, fee: Fee<ChainType>) => string
}

class EthAddress implements Address<'ETH'> {
  alias: string
  address: string
  privateKey: string

  constructor(alias: string, privateKey: string, address: string) {
    this.alias = alias
    this.address = address
    this.privateKey = privateKey
  }

  sign(unsignedTx: string): Promise<string> {
    return null as any
  }

  createTx(to: string, amount: string, fee: Fee<'ETH'>): string {
    return null as any
  }
}

class BtcAddress implements Address<'BTC'> {
  alias: string
  address: string
  privateKey: string

  constructor(alias: string, privateKey: string, address: string) {
    this.alias = alias
    this.address = address
    this.privateKey = privateKey
  }

  sign(unsignedTx: string): Promise<string> {

    return null as any
  }

  createTx(to: string, amount: string, fee: Fee<'BTC'>): string {

    return null as any
  }
}

export function createAddress<ChainType extends Blockchain>(
  type: ChainType,
  alias: string,
  privateKey: string, address: string
): Address<ChainType> {
  switch (type) {
    case 'ETH':
      return new EthAddress(alias, privateKey, address) as any
    case 'BTC':
      return new BtcAddress(alias, privateKey, address) as any
    default:
      throw new Error('Unsupported chain type')
  }
}