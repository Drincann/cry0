import { Fee, Utxo } from "./types.mjs";
import * as bitcoin from 'bitcoinjs-lib';
import { getBtcNetwork } from "../env/index.mjs";
import { BtcAddress } from './address.mjs';

export function createTransaction(
  { from, to, amount, fee, utxos }: {
    from: BtcAddress,
    to: string,
    amount: number,
    fee: Fee<'BTC'>,
    utxos: Utxo[]
  }
): UnsignedBtcTransaction {
  const network = getBtcNetwork();
  const tx = new bitcoin.Psbt({ network })
  utxos.forEach(utxo => {
    tx.addInput({
      hash: utxo.hash,
      index: utxo.index,
      witnessUtxo: {
        script: bitcoin.payments.p2wpkh({
          pubkey: Buffer.from(from.publicKey, 'hex'),
          network
        }).output!,
        value: utxo.value,
      }
    })
  })
  tx.addOutput({
    address: to,
    value: amount
  })
  const change = utxos.reduce((acc, utxo) => acc + utxo.value, 0) - fee.sats - amount
  if (change > 0) {
    tx.addOutput({
      address: from.address,
      value: change
    })
  }

  return new UnsignedBtcTransaction(tx)
}

export class SignedBtcTransaction {
  tx: bitcoin.Transaction

  constructor(tx: bitcoin.Transaction) {
    this.tx = tx
  }

  hex(): string {
    return this.tx.toHex()
  }
}

export class UnsignedBtcTransaction {
  tx: bitcoin.Psbt

  constructor(tx: bitcoin.Psbt) {
    this.tx = tx
  }
}

export function calcVSizeFromHex(rawHex: string): number {
  const tx = bitcoin.Transaction.fromHex(rawHex);
  const weight = tx.weight();
  return Math.ceil(weight / 4);
}
