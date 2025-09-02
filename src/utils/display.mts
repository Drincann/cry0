import { Account } from "../domain/account.mjs";
import { Address } from "../domain/address.mjs";

export function accountSummary(accounts: Map<string, Account>) {
  return [...accounts.entries()].map(([alias, account]) => `${alias} ${addressSummary(account.addresses)}`).join(', ');
}

export function addressSummary(addresses: { ETH: Address; BTC: Address; }) {
  return `BTC ${addresses.BTC.address.slice(0, 4)}...${addresses.BTC.address.slice(-4)}, ETH ${addresses.ETH.address.slice(0, 4)}...${addresses.ETH.address.slice(-4)}`;
}
