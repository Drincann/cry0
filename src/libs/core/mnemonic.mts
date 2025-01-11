import BIP32Factory from 'bip32';
import * as ecc from 'tiny-secp256k1';
import * as bitcoin from 'bitcoinjs-lib'; // 引入 bitcoinjs-lib
import { publicToAddress, importPublic } from '@ethereumjs/util'; // 引入 ethereumjs-util
import * as mnemoniclib from 'bip39'
import { wordsToEntropyBufferSize } from '../utils/mnemonic.mjs';
import { Mnemonic } from './types.mjs';

const path = {
  ethPath: "m/44'/60'/0'/0",
  btcPath: "m/84'/0'/0'/0"
}

const bip32 = BIP32Factory(ecc)

export function generate(
  wordsLength: 12 | 15 | 18 | 21 | 24,
  entropyGenerator?: (size: number) => Buffer
): string {
  const words = mnemoniclib.generateMnemonic(wordsToEntropyBufferSize(wordsLength), entropyGenerator)
  return words
}

/**
 * btc:
 *  - private key: wif
 *  - public key: hex
 *  - address: Bech32 (p2wpkh)
 * 
 * eth:
 *  - private key: hex
 *  - public key: hex
 *  - address: hex
 */
export function derive(mnemonic: Mnemonic, index: number): {
  ETH: {
    privateKey: string,
    publicKey: string,
    address: string
  },
  BTC: {
    privateKey: string,
    publicKey: string,
    address: string
  }
} {
  const seed = mnemoniclib.mnemonicToSeedSync(mnemonic.words, mnemonic.passphrase)

  const ethNode = bip32.fromSeed(seed).derivePath(path.ethPath).derive(index)
  const btcNode = bip32.fromSeed(seed).derivePath(path.btcPath).derive(index)

  return {
    ETH: {
      privateKey: paddingHexPrefix(Buffer.from(ethNode.privateKey!).toString('hex')),
      publicKey: Buffer.from(ethNode.publicKey).toString('hex'),
      address: paddingHexPrefix(Buffer.from(publicToAddress(importPublic(ethNode.publicKey))).toString('hex'))
    },
    BTC: {
      privateKey: btcNode.toWIF(),
      publicKey: Buffer.from(btcNode.publicKey).toString('hex'),
      address: bitcoin.payments.p2wpkh({ pubkey: Buffer.from(btcNode.publicKey) }).address!
    }
  }
}
function paddingHexPrefix(hex: string): string {
  if (!hex.startsWith('0x')) {
    return '0x' + hex
  }

  return hex
}

