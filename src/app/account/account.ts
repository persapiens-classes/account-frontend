import { Category } from '../category/category';
import { z } from 'zod';

export const AccountSchema = z.object({
  description: z.string(),
  category: z.string(),
});

export type Account = z.infer<typeof AccountSchema>;

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
  category: Category;
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
