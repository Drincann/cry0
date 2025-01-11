export type Blockchain = 'ETH' | 'BTC'

export type Fee<Blockchain> =
  Blockchain extends 'ETH' ? { gasLimit: string, gasPrice: string }
  : Blockchain extends 'BTC' ? { feeRate: string }
  : never

export interface Mnemonic {
  words: string
  passphrase?: string
}

export interface Collections {
  wallets: WalletData[]
}

// TODO: just make it work first
export interface WalletData {
  alias: string
  mnemonic: Mnemonic
  accounts: AccountData[]
}

export interface AccountData {
  alias: string
  index: number // derive from index
}
