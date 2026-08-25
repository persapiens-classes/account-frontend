/// <reference types="cypress" />

import { CategoryType } from '../../../../src/app/category/category';

declare global {
  namespace Cypress {
    interface Chainable {
      navigateToCategoriesList(type: CategoryType): Chainable<void>;
      navigateToCategoriesNew(type: CategoryType): Chainable<void>;
    }
  }
}

/**
 * Navigate to categories list page
 */
Cypress.Commands.add('navigateToCategoriesList', (type) => {
  // Navigate to categories list
  cy.getDataCy(`menu-category`).should('be.visible').click();
  cy.getDataCy(`menu-category-${type.toLowerCase()}`).should('be.visible').click();
  //cy.url().should('include', `/${type.toLowerCase()}Categories/list`);
});

/**
 * Navigate to categories new page
 */
Cypress.Commands.add('navigateToCategoriesNew', (type) => {
  // Path to category creation page
  cy.navigateToCategoriesList(type);
  cy.getDataCy('create-button').should('be.visible').click();
  cy.url().should('include', `/${type}Categories/new`);
});

export {}; // NOSONAR - required for module scope with global augmentation typescript:S7787
