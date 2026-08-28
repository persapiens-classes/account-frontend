/// <reference types="cypress" />

import { ModelCrudApiMock } from './model-crud-api-mock';
import { API_PATHS } from '../../../src/app/app.api-paths';
import { balancesDefault } from '../fakers/models-default';
import { Balance } from '../../../src/app/balance/balance';

export function balanceApiMock(): ModelCrudApiMock<Balance, Balance, Balance, string> {
  const balancesEndpoint = `/${API_PATHS.BALANCE_API_PATH}`;

  const idFn = (model: Balance): string => `${model.owner}-${model.equityAccount.description}`;

  const balances = balancesDefault();

  return new ModelCrudApiMock<Balance, Balance, Balance, string>({
    endpoint: balancesEndpoint,
    idFn: idFn,
    models: balances,
  });
}
