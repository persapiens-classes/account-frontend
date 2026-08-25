/// <reference types="cypress" />

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
  // Navigate to owners list
  cy.getDataCy('menu-owner').should('be.visible').click();
  cy.url().should('include', '/owners/list');
});

/**
 * Navigate to owners new page
 */
Cypress.Commands.add('navigateToOwnersNew', () => {
  // Path to owner creation page
  cy.navigateToOwnersList();
  cy.getDataCy('create-button').should('be.visible').click();
  cy.url().should('include', '/owners/new');
});

export {}; // NOSONAR - required for module scope with global augmentation typescript:S7787
