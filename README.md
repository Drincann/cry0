# cry0

Cry0 is an open-source, lightweight command-line tool designed for easy management of cold wallets and offline transaction signing. It currently supports Bitcoin (BTC) and Ethereum (ETH) and will gradually expand to include more blockchains in the future.

# Installation

```fish
git clone git@github.com:Drincann/cry0.git
cd cry0
npm i
npx tsc
npm link
```

# Usage

## Address

Create a new wallet

```fish
cry0 wallet create --alias my-wallet
```

Import a wallet using mnemonic with passphrase(optional)

```fish
cry0 wallet create --alias my-wallet --mnemonic "word1 word2 word3 ..." --passphrase "passphrase"
```

Create a temporary wallet(only display in console)

```fish
cry0 wallet create --ephemeral
```

List all wallets

```fish
cry0 wallet list
```

Show account details with private key

```fish
cry0 wallet show my-wallet --private
```

Rename wallet

```fish
cry0 wallet rename my-wallet new-wallet
```

Delete wallet

```fish
cry0 wallet remove my-wallet
```

## Transaction (only BTC is supported now)

Create and sign a transaction:

```fish
cry0 tx sign --from my-wallet@default --to tb1qamc6hlgvd5e9j8x6dfkl78m6jc3g6xq732hzxk \
  --amount 1500 --fee 500 \
  --utxo c5fa5d71deaa6731fb906622ac431b0acd88e26c81272ef26bd8bd35fb3082f2:0:1000 \
  --utxo 8ab61a6dc59637de8bdd9d04a4b9fd134d3261c77f3c5ae696e26d3538d64241:0:500 \
  --utxo f58a8230110604ffc28c46ff7a2e616514526f4a436831a9063325f9056e9d4a:0:500
```

Broadcast a transaction:

```fish
cry0 tx broadcast --tx <tx-content> --provider mempool-testnet4
```

Create sign and broadcast with `--broadcast <provider-name-or-url>` directly:

```fish
cry0 tx sign --from my-wallet@default --to tb1qamc6hlgvd5e9j8x6dfkl78m6jc3g6xq732hzxk \
  --amount 859 --fee 141 \
  --utxo c5fa5d71deaa6731fb906622ac431b0acd88e26c81272ef26bd8bd35fb3082f2:0:1000 \
  --broadcast mempool-testnet4
```

## Env

- `CRYO_GLOBAL_PASSPHRASE`: Set the passphrase for the CLI
- `CRYO_GLOBAL_BITCOIN_NETWORK`: Set the Bitcoin network: 'mainnet' (or 'bitcoin'), 'regtest', 'testnet'
- `DEBUG`: Show debug logs if set.
