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

## Wallets

```fish
cry0 help wallet

cry0 wallet help create

cry0 wallet help remove

cry0 wallet help rename

cry0 wallet help list

cry0 wallet help show

```

```
Usage: cry0 wallet [options] [command]

Manage wallets

Options:
  -h, --help                         display help for command

Commands:
  create [options]                   Create a new wallet
  rename <wallet-alias> <new-alias>
  show [options] <wallet-alias>
  list                               List all wallets
  remove [options] <wallet-alias>
  help [command]                     display help for command

```

Example:

create a new wallet

```fish
cry0 wallet create --alias my-wallet
```

import a wallet using mnemonic

```fish
cry0 wallet create --alias my-wallet --mnemonic "word1 word2 word3 ..." --passphrase "passphrase"
```

list all wallets

```fish
cry0 wallet list
```

show account details with private key

```fish
cry0 wallet show my-wallet --private
```

rename wallet

```fish
cry0 wallet rename my-wallet new-wallet
```

## Address

In development...

## Transaction

In development...
