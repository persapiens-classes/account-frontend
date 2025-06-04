import { Account } from '../account/account';
import { Bean } from '../bean/bean';

export class Balance implements Bean {
  constructor(
    public owner: string,
    public equityAccount: Account,
    public initialValue: number,
    public balance: number,
  ) {}
  getId(): string {
    return `owner=${this.owner}&equityAccount=${this.equityAccount.description}`;
  }
}

export function createBalance(): Balance {
  return new Balance('', new Account('', ''), 0, 0);
}
