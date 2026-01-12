import { Account } from '../account/account';
import { Bean } from '../bean/bean';

export class OwnerEquityAccountInitialValue implements Bean {
  constructor(
    public owner: string,
    public equityAccount: Account,
    public initialValue: number,
  ) {}
  getId(): string {
    return `owner=${this.owner}&equityAccount=${this.equityAccount.description}`;
  }
}

export interface OwnerEquityAccountInitialValueInsert {
  owner: string;
  equityAccount: string;
  initialValue: number;
}

export function createOwnerEquityAccountInitialValue(): OwnerEquityAccountInitialValue {
  return new OwnerEquityAccountInitialValue('', new Account('', ''), 0);
}
