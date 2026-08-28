/// <reference types="cypress" />

import { listPath, newPath, PATHS } from '../../../../src/app/app.paths';

declare global {
  namespace Cypress {
    interface Chainable {
      navigateToBalanceList(): Chainable<void>;
      navigateToBalanceNew(): Chainable<void>;
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

export {}; // NOSONAR - required for module scope with global augmentation typescript:S7787
