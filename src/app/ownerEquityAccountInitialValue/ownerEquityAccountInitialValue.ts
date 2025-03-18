import { Account } from "../account/account";
import { Bean } from "../bean/bean";

export class OwnerEquityAccountInitialValue implements Bean {
  constructor(public owner: string, public equityAccount: Account, public value: number) { }
  getId(): string {
    return `owner=${this.owner}&equityAccount=${this.equityAccount.description}`
  }
}

export class OwnerEquityAccountInitialValueInsert {
  constructor(public owner: string, public equityAccount: string, public value: number) { }
}

export function createOwnerEquityAccountInitialValue(): OwnerEquityAccountInitialValue {
  return new OwnerEquityAccountInitialValue('', new Account('', ''), 0)
}