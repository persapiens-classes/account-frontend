/// <reference types="cypress" />

import { listPath, newPath } from '../../../../src/app/app.paths';
import { AccountType } from '../../../../src/app/account/account';
import { accountPath } from '../../../e2e/account/account-helpers';

declare global {
  namespace Cypress {
    interface Chainable {
      navigateToAccountList(type: AccountType): Chainable<void>;
      navigateToAccountNew(type: AccountType): Chainable<void>;
    }
  }
}

/**
 * Navigate to account list page
 */
Cypress.Commands.add('navigateToAccountList', (type) => {
  cy.getDataCy(`menu-account`).should('be.visible').click();
  cy.getDataCy(`menu-account-${type.toLowerCase()}`).should('be.visible').click();
  cy.url().should('include', listPath(accountPath(type)));
});

/**
 * Navigate to account new page
 */
Cypress.Commands.add('navigateToAccountNew', (type) => {
  // Path to account creation page
  cy.navigateToAccountList(type);
  cy.getDataCy('create-button').should('be.visible').click();
  cy.url().should('include', newPath(accountPath(type)));
});

export {}; // NOSONAR - required for module scope with global augmentation typescript:S7787
