import { Account } from '../account/account';

export interface Balance {
  owner: string;
  equityAccount: Account;
  initialValue: number;
  balance: number;
}

export function balanceId(balance: Balance): string {
  return `owner=${balance.owner}&equityAccount=${balance.equityAccount.description}`;
}
