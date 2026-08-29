/// <reference types="cypress" />

import { listPath, newPath, PATHS } from '../../../../src/app/app.paths';
import { Balance } from '../../../../src/app/balance/balance';
import { OwnerEquityAccountInitialValue } from '../../../../src/app/balance/owner-equity-account-initial-value';
import {
  balancesDefault,
  ownerEquityAccountInitialValuesDefault,
} from '../../fakers/models-default';

declare global {
  namespace Cypress {
    interface Chainable {
      navigateToBalanceList(): Chainable<void>;
      navigateToBalanceNew(): Chainable<void>;
      balancesDefault(): Chainable<Balance[]>;
      ownerEquityAccountInitialValuesDefault(): Chainable<OwnerEquityAccountInitialValue[]>;
    }
  }
}

/**
 * Navigate to balance list page
 */
Cypress.Commands.add('navigateToBalanceList', () => {
  cy.getDataCy('menu-balance').should('be.visible').click();
  cy.url().should('include', listPath(PATHS.BALANCE_PATH));
});

/**
 * Navigate to balance new page
 */
Cypress.Commands.add('navigateToBalanceNew', () => {
  // Path to balance creation page
  cy.navigateToBalanceList();
  cy.getDataCy('create-button').should('be.visible').click();
  cy.url().should('include', newPath(PATHS.BALANCE_PATH));
});

Cypress.Commands.add('ownerEquityAccountInitialValuesDefault', () => {
  return cy.wrap(ownerEquityAccountInitialValuesDefault());
});

Cypress.Commands.add('balancesDefault', () => {
  return cy.wrap(balancesDefault());
});

export {}; // NOSONAR - required for module scope with global augmentation typescript:S7787
