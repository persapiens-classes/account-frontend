/// <reference types="cypress" />

import { ModelCrudApiMock, validate, validateNumber } from './model-crud-api-mock';
import { API_PATHS } from '../../../src/app/app.api-paths';
import {
  accountsDefault,
  ownerEquityAccountInitialValuesDefault,
  ownersDefault,
} from '../fakers/models-default';
import {
  OwnerEquityAccountInitialValue,
  OwnerEquityAccountInitialValueInsert,
} from '../../../src/app/balance/owner-equity-account-initial-value';
import { AccountType } from '../../../src/app/account/account';

export function ownerEquityAccountInitialValueApiMock(): ModelCrudApiMock<
  OwnerEquityAccountInitialValueInsert,
  number,
  OwnerEquityAccountInitialValue
> {
  const ownerEquityAccountInitialValuesEndpoint = `/${API_PATHS.OWNER_EQUITY_ACCOUNT_INITIAL_VALUE_API_PATH}`;

  const idFn = (model: OwnerEquityAccountInitialValue): string =>
    `${model.owner}-${model.equityAccount.description}`;

  const idDeleteUpdateFn = (model: OwnerEquityAccountInitialValue): string =>
    `owner=${model.owner}&equityAccount=${model.equityAccount.description}`;

  const ownerEquityAccountInitialValues = ownerEquityAccountInitialValuesDefault();

  const postValidateFn = (
    entry: OwnerEquityAccountInitialValueInsert | undefined,
  ): string | null => {
    let result = validate('Owner name', entry?.owner);

    if (!result) {
      result = validate('Equity Account description', entry?.equityAccount);
    }

    return result;
  };

  const putValidateFn = (initialValue: number | undefined): string | null => {
    return validateNumber('number', initialValue);
  };

  const equityAccounts = accountsDefault(AccountType.EQUITY);

  const insertToModelFn = (
    insertModel: OwnerEquityAccountInitialValueInsert,
  ): OwnerEquityAccountInitialValue => {
    return {
      owner: insertModel.owner,
      equityAccount: equityAccounts.find((a) => a.description === insertModel.equityAccount)!,
      initialValue: insertModel.initialValue,
    };
  };

  const updateToModelFn = (updateModel: number, id?: string): OwnerEquityAccountInitialValue => {
    const owners = ownersDefault();
    const params = new URLSearchParams(id);
    const owner = params.get('owner') ?? '';
    const equityAccount = params.get('equityAccount') ?? '';

    return {
      owner: owners.find((a) => a.name === owner)!.name,
      equityAccount: equityAccounts.find((a) => a.description === equityAccount)!,
      initialValue: updateModel,
    };
  };

  const equalsFn = (
    model1: OwnerEquityAccountInitialValue,
    model2: OwnerEquityAccountInitialValue,
  ): boolean => {
    return (
      model1.owner === model2.owner &&
      model1.equityAccount === model2.equityAccount &&
      model1.initialValue === model2.initialValue
    );
  };

  return new ModelCrudApiMock<
    OwnerEquityAccountInitialValueInsert,
    number,
    OwnerEquityAccountInitialValue
  >({
    endpoint: ownerEquityAccountInitialValuesEndpoint,
    idFn: idFn,
    models: ownerEquityAccountInitialValues,
    postValidateFn: postValidateFn,
    putValidateFn: putValidateFn,
    insertToModelFn: insertToModelFn,
    updateToModelFn: updateToModelFn,
    equalsFn: equalsFn,
    idDeleteUpdateFn: idDeleteUpdateFn,
  });
}
