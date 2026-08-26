/// <reference types="cypress" />

import { listPath, newPath } from '../../../../src/app/app.paths';
import { AccountType } from '../../../../src/app/account/account';
import { accountPath } from '../../../e2e/accounts/account-helpers';

declare global {
  namespace Cypress {
    interface Chainable {
      navigateToAccountsList(type: AccountType): Chainable<void>;
      navigateToAccountsNew(type: AccountType): Chainable<void>;
    }
  }
}

/**
 * Navigate to accounts list page
 */
Cypress.Commands.add('navigateToAccountsList', (type) => {
  cy.getDataCy(`menu-account`).should('be.visible').click();
  cy.getDataCy(`menu-account-${type.toLowerCase()}`).should('be.visible').click();
  cy.url().should('include', listPath(accountPath(type)));
});

/**
 * Navigate to accounts new page
 */
Cypress.Commands.add('navigateToAccountsNew', (type) => {
  // Path to account creation page
  cy.navigateToAccountsList(type);
  cy.getDataCy('create-button').should('be.visible').click();
  cy.url().should('include', newPath(accountPath(type)));
});

export {}; // NOSONAR - required for module scope with global augmentation typescript:S7787
