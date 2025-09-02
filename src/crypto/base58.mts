import base from 'base-x'

const base58 = base('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz')

export function decode(encoded: string): string {
  return Buffer.from(base58.decode(encoded)).toString('hex')
}

export function encode(hex: string): string {
  return base58.encode(Uint8Array.from(Buffer.from(hex, 'hex')))
}

export function isNotValidBase58(value: string): boolean {
  try {
    decode(value)
    return false
  } catch (e: unknown) {
    return true
  }
}
