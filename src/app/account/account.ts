import { Bean } from '../bean/bean';
import { Category } from '../category/category';

export class Account implements Bean {
  constructor(
    public description: string,
    public category: string,
  ) {}

  getId(): string {
    return this.description;
  }
}

export function createAccount(): Account {
  return new Account('', '');
}

export enum AccountType {
  CREDIT = 'Credit',
  DEBIT = 'Debit',
  EQUITY = 'Equity',
}

export interface AccountForm {
  description: string;
  category: Category | null;
}

export function accountFormToModel(accountForm: AccountForm): Account {
  return new Account(
    accountForm.description,
    accountForm.category ? accountForm.category.description : '',
  );
}

export function accountModelToForm(account: Account): AccountForm {
  return {
    description: account.description,
    category: new Category(account.category),
  };
}
