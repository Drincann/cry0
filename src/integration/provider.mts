import { CliParameterError } from "../error/cli-error.mjs";
import { isUrl } from "../utils/validator.mjs";

export interface Provider {
  broadcast(tx: string): Promise<string>;
}

export function createProvider(type: string): Provider {
  switch (type.toLowerCase()) {
    case 'mempool-mainnet':
      return new MempoolMainnet()
    case 'mempool-testnet3':
      return new MempoolTestnet3()
    case 'mempool-testnet4':
      return new MempoolTestnet4()
    default:
      if (isUrl(type)) {
        return new CommonPostProvider(type)
      }
      throw new CliParameterError('Invalid provider \'' + type + '\', it should be mempool-mainnet, mempool-testnet3, mempool-testnet4 or a valid url')
  }
}

export class MempoolMainnet implements Provider {
  async broadcast(tx: string): Promise<string> {
    const response = await fetch('https://mempool.space/api/tx', {
      method: 'POST',
      body: tx
    })
    return response.text()
  }
}

export class MempoolTestnet3 implements Provider {
  async broadcast(tx: string): Promise<string> {
    const response = await fetch('https://mempool.space/testnet/api/tx', {
      method: 'POST',
      body: tx
    })
    return response.text()
  }
}

export class MempoolTestnet4 implements Provider {
  async broadcast(tx: string): Promise<string> {
    const response = await fetch('https://mempool.space/testnet4/api/tx', {
      method: 'POST',
      body: tx
    })
    return response.text()
  }
}

export class CommonPostProvider implements Provider {
  constructor(private url: string) { }
  async broadcast(tx: string): Promise<string> {
    const response = await fetch(this.url, {
      method: 'POST',
      body: tx
    })
    return response.text()
  }
}
