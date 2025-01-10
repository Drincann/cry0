import { Account } from "../../lib/core/account.mjs";
import { Address } from "../../lib/core/address.mjs";

export function thumb(accounts: Map<string, Account>) {
  return [...accounts.entries()].map(([alias, account]) => `${alias} ${thumbAddresses(account.addresses)}`).join(', ');
}

export function thumbAddresses(addresses: { ETH: Address<"ETH">; BTC: Address<"BTC">; }) {
  return `BTC ${addresses.BTC.address.slice(0, 4)}...${addresses.BTC.address.slice(-4)}, ETH ${addresses.ETH.address.slice(0, 4)}...${addresses.ETH.address.slice(-4)}`;
}
