/// <reference types="cypress" />

import { listPath, newPath, PATHS } from '../../../../src/app/app.paths';

declare global {
  namespace Cypress {
    interface Chainable {
      navigateToOwnersList(): Chainable<void>;
      navigateToOwnersNew(): Chainable<void>;
    }
  }
}

/**
 * Navigate to owners list page
 */
Cypress.Commands.add('navigateToOwnersList', () => {
  cy.getDataCy('menu-owner').should('be.visible').click();
  cy.url().should('include', listPath(PATHS.OWNER_PATH));
});

/**
 * Navigate to owners new page
 */
Cypress.Commands.add('navigateToOwnersNew', () => {
  // Path to owner creation page
  cy.navigateToOwnersList();
  cy.getDataCy('create-button').should('be.visible').click();
  cy.url().should('include', newPath(PATHS.OWNER_PATH));
});

export {}; // NOSONAR - required for module scope with global augmentation typescript:S7787
