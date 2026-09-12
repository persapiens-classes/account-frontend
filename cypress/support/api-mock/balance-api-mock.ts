/// <reference types="cypress" />

import { ModelCrudApiMock } from './model-crud-api-mock';
import { API_PATHS } from '../../../src/app/app.api-paths';
import { balancesDefault } from '../fakers/models-default';
import { Balance } from '../../../src/app/balance/balance';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { OwnerEquityAccountInitialValue } from '../../../src/app/balance/owner-equity-account-initial-value';

export function balanceApiMock(): {
  insertNotifyFn: (model: OwnerEquityAccountInitialValue) => void;
  modelCrudApiMock: ModelCrudApiMock<Balance, Balance, Balance>;
} {
  const idFn = (model: Balance): string => `${model.owner}-${model.equityAccount.description}`;

  const balances = balancesDefault();

  const insertNotifyFn = (model: OwnerEquityAccountInitialValue): void => {
    balances.push({
      owner: model.owner,
      equityAccount: model.equityAccount,
      initialValue: model.initialValue,
      balance: model.initialValue,
    });
  };

  const balanceFilter = () => {
    const balancesFilterEndpoint = `/${API_PATHS.BALANCE_API_PATH}/filter*`;
    cy.intercept('GET', balancesFilterEndpoint, (req) => {
      const { owner, equityAccount } = req.query;
      if (owner && equityAccount) {
        req.reply({
          statusCode: StatusCodes.OK,
          body: balances.find((balance) => {
            return balance.owner === owner && balance.equityAccount.description === equityAccount;
          }),
        });
      }
    }).as('balancesEndpoint-filter');
  };

  return {
    insertNotifyFn: insertNotifyFn,
    modelCrudApiMock: new ModelCrudApiMock<Balance, Balance, Balance>({
      endpoint: `/${API_PATHS.BALANCE_API_PATH}`,
      idFn: idFn,
      models: balances,
      customMocks: [balanceFilter],
    }),
  };
}
