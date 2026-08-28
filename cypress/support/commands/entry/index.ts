/// <reference types="cypress" />

import { listPath, newPath } from '../../../../src/app/app.paths';
import { Entry, EntryType } from '../../../../src/app/entry/entry';
import { entryPath } from '../../../e2e/entry/entry-helpers';
import { entriesDefault } from '../../fakers/models-default';

declare global {
  namespace Cypress {
    interface Chainable {
      navigateToEntryList(type: EntryType): Chainable<void>;
      navigateToEntryNew(type: EntryType): Chainable<void>;
      entriesDefault(type: EntryType): Chainable<Entry[]>;
    }
  }
}

/**
 * Navigate to entry list page
 */
Cypress.Commands.add('navigateToEntryList', (type) => {
  cy.getDataCy(`menu-${type.toLowerCase()}-entry`).should('be.visible').click();
  cy.url().should('include', listPath(entryPath(type)));
});

/**
 * Navigate to entry new page
 */
Cypress.Commands.add('navigateToEntryNew', (type) => {
  // Path to account creation page
  cy.navigateToEntryList(type);
  cy.getDataCy('create-button').should('be.visible').click();
  cy.url().should('include', newPath(entryPath(type)));
});

Cypress.Commands.add('entriesDefault', (type) => {
  return cy.wrap(entriesDefault(type));
});

export {}; // NOSONAR - required for module scope with global augmentation typescript:S7787
