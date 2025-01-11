export type Blockchain = 'ETH' | 'BTC'

export type Fee<Blockchain> =
  Blockchain extends 'ETH' ? { gasLimit: string, gasPrice: string }
  : Blockchain extends 'BTC' ? { feeRate: string }
  : never

export interface Mnemonic {
  words: string
  passphrase?: string
}

export interface MnemonicWithoutPassphrase {
  words: string
  hasPassphrase: boolean
}

export interface Collections {
  wallets: WalletDataWithoutPassphrase[]
}

// 脱敏的
export interface WalletDataWithoutPassphrase {
  alias: string
  mnemonic: MnemonicWithoutPassphrase
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
