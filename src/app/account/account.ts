import { Category } from '../category/category';

export interface Account {
  description: string;
  category: string;
}

export function accountId(account: Account): string {
  return account.description;
}

export function createAccount(): Account {
  return {
    description: '',
    category: '',
  };
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
  return {
    description: accountForm.description,
    category: accountForm.category ? accountForm.category.description : '',
  };
}

export function accountModelToForm(account: Account): AccountForm {
  return {
    description: account.description,
    category: { description: account.category },
  };
}
