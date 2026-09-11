import { form, maxLength, minLength, required } from '@angular/forms/signals';
import { Account, AccountForm } from './account';
import { signal } from '@angular/core';
import { MAX_LENGTH } from '../models/models';

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
