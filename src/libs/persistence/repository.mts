import { UserHomeJsonStorage } from "./storage.mjs"
import type { Collections, WalletDataWithoutPassphrase } from "../core/types.mjs"

class WalletRepository {
  private storage: UserHomeJsonStorage<Collections> = new UserHomeJsonStorage()
  public async getAllWallets(): Promise<WalletDataWithoutPassphrase[]> {
    return await this.storage.load('wallets') ?? []
  }

  public async getWallet(alias: string): Promise<WalletDataWithoutPassphrase | undefined> {
    return (await this.getAllWallets()).find(wallet => wallet.alias === alias)
  }

  public async save(wallet: WalletDataWithoutPassphrase): Promise<void> {
    await this.storage.save('wallets', [...await this.storage.load('wallets') ?? [], wallet])
  }

  public async remove(walletAlias: string) {
    this.storage.save('wallets', (await this.storage.load('wallets')).filter(wallet => wallet.alias !== walletAlias))
  }

  public async rename(fromWallet: any, toWallet: any) {
    this.storage.save('wallets', (await this.storage.load('wallets')).map(wallet => {
      if (wallet.alias === fromWallet) {
        wallet.alias = toWallet
      }
      return wallet
    }))
  }
}

export const repositories = {
  wallet: new WalletRepository()
}
