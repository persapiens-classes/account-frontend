/// <reference types="cypress" />

import { listPath, newPath, PATHS } from '../../../../src/app/app.paths';

declare global {
  namespace Cypress {
    interface Chainable {
      navigateToOwnerList(): Chainable<void>;
      navigateToOwnerNew(): Chainable<void>;
    }
  }
}

/**
 * Navigate to owner list page
 */
Cypress.Commands.add('navigateToOwnerList', () => {
  cy.getDataCy('menu-owner').should('be.visible').click();
  cy.url().should('include', listPath(PATHS.OWNER_PATH));
});

/**
 * Navigate to owner new page
 */
Cypress.Commands.add('navigateToOwnerNew', () => {
  // Path to owner creation page
  cy.navigateToOwnerList();
  cy.getDataCy('create-button').should('be.visible').click();
  cy.url().should('include', newPath(PATHS.OWNER_PATH));
});

export {}; // NOSONAR - required for module scope with global augmentation typescript:S7787
