/// <reference types="cypress" />

import { ModelCrudApiMock } from './model-crud-api-mock';
import { API_PATHS } from '../../../src/app/app.api-paths';
import { balancesDefault } from '../fakers/models-default';
import { Balance } from '../../../src/app/balance/balance';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';

export function balanceApiMock(): ModelCrudApiMock<Balance, Balance, Balance, string> {
  const balancesEndpoint = `/${API_PATHS.BALANCE_API_PATH}`;

  const balancesFilterEndpoint = `/${API_PATHS.BALANCE_API_PATH}/filter`;

  const idFn = (model: Balance): string => `${model.owner}-${model.equityAccount.description}`;

  const balances = balancesDefault();

  const balanceFilter = () => {
    cy.intercept('GET', balancesFilterEndpoint, (req) => {
      const { owner, equityAccount } = req.query;
      console.log(`Filtering balances by owner: ${owner}, equityAccount: ${equityAccount}`);
      if (owner && equityAccount) {
        console.log(
          `Returning filtered balances: ${JSON.stringify(balances.filter((balance) => balance.owner === owner && balance.equityAccount.description === equityAccount))}`,
        );
        req.reply({
          statusCode: StatusCodes.OK,
          body: balances.filter((balance) => {
            return balance.owner === owner && balance.equityAccount.description === equityAccount;
          }),
        });
      }
    }).as('balancesEndpoint-filter');
  };

  return new ModelCrudApiMock<Balance, Balance, Balance, string>({
    endpoint: balancesEndpoint,
    idFn: idFn,
    models: balances,
    customMocks: [balanceFilter],
  });
}
