import { Account, createAccount } from '../account/account';

export interface OwnerEquityAccountInitialValue {
  owner: string;
  equityAccount: Account;
  initialValue: number;
}

export function ownerEquityAccountInitialValueId(
  ownerEquityAccountInitialValue: OwnerEquityAccountInitialValue,
): string {
  return `owner=${ownerEquityAccountInitialValue.owner}&equityAccount=${ownerEquityAccountInitialValue.equityAccount.description}`;
}

export interface OwnerEquityAccountInitialValueInsert {
  owner: string;
  equityAccount: string;
  initialValue: number;
}

export function createOwnerEquityAccountInitialValue(): OwnerEquityAccountInitialValue {
  return {
    owner: '',
    equityAccount: createAccount(),
    initialValue: 0,
  };
}
