/// <reference types="cypress" />

import { listPath, newPath } from '../../../../src/app/app.paths';
import { EntryType } from '../../../../src/app/entry/entry';
import { entryPath } from '../../../e2e/entries/entry-helpers';

declare global {
  namespace Cypress {
    interface Chainable {
      navigateToEntriesList(type: EntryType): Chainable<void>;
      navigateToEntriesNew(type: EntryType): Chainable<void>;
    }
  }
}

/**
 * Navigate to entries list page
 */
Cypress.Commands.add('navigateToEntriesList', (type) => {
  cy.getDataCy(`menu-account`).should('be.visible').click();
  cy.getDataCy(`menu-account-${type.toLowerCase()}`).should('be.visible').click();
  cy.url().should('include', listPath(entryPath(type)));
});

/**
 * Navigate to entries new page
 */
Cypress.Commands.add('navigateToEntriesNew', (type) => {
  // Path to account creation page
  cy.navigateToEntriesList(type);
  cy.getDataCy('create-button').should('be.visible').click();
  cy.url().should('include', newPath(entryPath(type)));
});

export {}; // NOSONAR - required for module scope with global augmentation typescript:S7787
