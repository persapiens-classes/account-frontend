/// <reference types="cypress" />

import { ModelCrudApiMock, validate } from './model-crud-api-mock';
import { Account, AccountType } from '../../../src/app/account/account';
import { accountApiPath } from '../../e2e/account/account-helpers';
import { accountsDefault } from '../fakers/models-default';

export function accountApiMock(type: AccountType): ModelCrudApiMock<Account, Account, Account> {
  const accountsEndpoint = `/${accountApiPath(type)}`;

  const idFn = (model: Account): string => model.description;

  const validateFn = (account: Account | undefined): string | null => {
    let result = validate('Account description', account?.description);

    if (!result) {
      result = validate('Account category', account?.category);
    }
    return result;
  };

  const accounts = accountsDefault(type);

  return new ModelCrudApiMock<Account, Account, Account>({
    endpoint: accountsEndpoint,
    idFn: idFn,
    models: accounts,
    postValidateFn: validateFn,
    putValidateFn: validateFn,
  });
}
