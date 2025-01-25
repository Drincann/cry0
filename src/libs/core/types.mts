export type Blockchain = 'ETH' | 'BTC'

export type Fee<Blockchain> =
  Blockchain extends 'ETH' ? { gasLimit: string, gasPrice: string }
  : Blockchain extends 'BTC' ? { feeRate: string }
  : never

export interface Mnemonic {
  words: string
  passphrase?: string
}

export interface StoredMnemonic {
  words: string
  hasPassphrase: boolean
  passphraseSha256?: string
}

export interface Collections {
  wallets: StoredWalletData[]
}

export interface StoredWalletData {
  alias: string
  mnemonic: StoredMnemonic
  accounts: AccountData[]
}

export interface WalletData {
  alias: string
  mnemonic: Mnemonic
  accounts: AccountData[]
}

export interface AccountData {
  alias: string
  index: number // derive from index
}
