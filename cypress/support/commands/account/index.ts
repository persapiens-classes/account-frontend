/// <reference types="cypress" />

import { listPath, newPath } from '../../../../src/app/app.paths';
import { Account, AccountType } from '../../../../src/app/account/account';
import { accountPath } from '../../../e2e/account/account-helpers';
import { accountsDefault } from '../../fakers/models-default';

declare global {
  namespace Cypress {
    interface Chainable {
      navigateToAccountList(type: AccountType): Chainable<void>;
      navigateToAccountNew(type: AccountType): Chainable<void>;
      creditAccountsDefault(): Chainable<Account[]>;
      debitAccountsDefault(): Chainable<Account[]>;
      transferAccountsDefault(): Chainable<Account[]>;
      equityAccountsDefault(): Chainable<Account[]>;
      accountsDefault(type: AccountType): Chainable<Account[]>;
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

Cypress.Commands.add('creditAccountsDefault', () => {
  return cy.wrap(accountsDefault(AccountType.CREDIT));
});

Cypress.Commands.add('debitAccountsDefault', () => {
  return cy.wrap(accountsDefault(AccountType.DEBIT));
});

Cypress.Commands.add('equityAccountsDefault', () => {
  return cy.wrap(accountsDefault(AccountType.EQUITY));
});

Cypress.Commands.add('accountsDefault', (type: AccountType) => {
  return cy.wrap(accountsDefault(type));
});

export {}; // NOSONAR - required for module scope with global augmentation typescript:S7787
