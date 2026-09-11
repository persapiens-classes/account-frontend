import { form, maxLength, minLength, required } from '@angular/forms/signals';
import { Category } from '../category/category';
import { z } from 'zod';
import { signal } from '@angular/core';
import { MAX_LENGTH } from '../models/models';

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

function accountModelToForm(account: Account): AccountForm {
  return {
    description: account.description,
    category: { description: account.category },
  };
}

export function accountForm(account: Account) {
  return form(signal(accountModelToForm(account)), (f) => {
    required(f.description);
    minLength(f.description, 3);
    maxLength(f.description, MAX_LENGTH);
    required(f.category);
    minLength(f.category.description, 3);
  });
}
