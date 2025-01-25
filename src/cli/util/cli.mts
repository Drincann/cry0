import prompts from "prompts";
import { Account } from "../../libs/core/account.mjs";
import { Address } from "../../libs/core/address.mjs";
import { repositories } from "../../libs/persistence/repository.mjs";
import { CliParameterError } from "../error/index.mjs";
import { hexSha256 } from "../../libs/utils/crypto.mjs";

export function accountSummary(accounts: Map<string, Account>) {
  return [...accounts.entries()].map(([alias, account]) => `${alias} ${addressSummary(account.addresses)}`).join(', ');
}

export function addressSummary(addresses: { ETH: Address<"ETH">; BTC: Address<"BTC">; }) {
  return `BTC ${addresses.BTC.address.slice(0, 4)}...${addresses.BTC.address.slice(-4)}, ETH ${addresses.ETH.address.slice(0, 4)}...${addresses.ETH.address.slice(-4)}`;
}

export async function ensureCliLevelSecretInitialized() {
  let cliPassphrase = emptyToUndefined(process.env.CRYO_GLOBAL_PASSPHRASE)
  const secretSha256 = await repositories.secret.get()
  if (secretSha256 === undefined) {
    if (cliPassphrase === undefined) {
      cliPassphrase = await questionUserToCreateCliPassphrase(cliPassphrase);
    }

    await repositories.secret.set(await hexSha256(cliPassphrase!))
  }

  if (cliPassphrase === undefined) {
    cliPassphrase = await questionCliPassphrase(cliPassphrase);
  }

  await checkHash(await repositories.secret.get(), cliPassphrase);

  await repositories.init(cliPassphrase)
}

async function questionUserToCreateCliPassphrase(cliPassphrase: string | undefined) {
  const { value: passphrase } = await prompts({
    type: 'password',
    name: 'value',
    message: 'Create a passphrase for the CLI'
  });

  if (isNotString(passphrase)) {
    throw new CliParameterError('CLI passphrase is required');
  }

  const { value: confirmPassphrase } = await prompts({
    type: 'password',
    name: 'value',
    message: 'Confirm passphrase'
  });
  if (confirmPassphrase !== passphrase) {
    throw new CliParameterError('Passphrases do not match');
  }

  cliPassphrase = passphrase;
  return cliPassphrase;
}

async function questionCliPassphrase(cliPassphrase: string | undefined) {
  const response = await prompts({
    type: 'password',
    name: 'value',
    message: 'Enter a passphrase for the CLI'
  });

  cliPassphrase = response.value;
  if (isNotString(cliPassphrase)) {
    throw new CliParameterError('CLI passphrase is required');
  }
  return cliPassphrase;
}

function isNotString(value: unknown): value is undefined {
  return typeof value !== 'string';
}
function emptyToUndefined(CRYO_GLOBAL_PASSPHRASE: string | undefined): string | undefined {
  return CRYO_GLOBAL_PASSPHRASE?.trim() === '' ? undefined : CRYO_GLOBAL_PASSPHRASE;
}

async function checkHash(fromRepository: string | undefined, fromUser: string) {
  if (typeof fromRepository !== 'string' || typeof fromUser !== 'string') {
    throw new CliParameterError('CLI passphrase is incorrect');
  }

  const hash = await hexSha256(fromUser)
  if (hash !== fromRepository) {
    throw new CliParameterError('CLI passphrase is incorrect');
  }
}

