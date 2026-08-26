/// <reference types="cypress" />

import { listPath, newPath } from '../../../../src/app/app.paths';
import { CategoryType } from '../../../../src/app/category/category';
import { categoryPath } from '../../../e2e/categories/category-helpers';

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
  console.log(`Navigating to ${type} categories list page menu-category-${type.toLowerCase()}...`);
  cy.getDataCy(`menu-category-${type.toLowerCase()}`).should('be.visible').click();
  cy.url().should('include', listPath(categoryPath(type)));
});

/**
 * Navigate to categories new page
 */
Cypress.Commands.add('navigateToCategoriesNew', (type) => {
  // Path to category creation page
  cy.navigateToCategoriesList(type);
  cy.getDataCy('create-button').should('be.visible').click();
  cy.url().should('include', newPath(categoryPath(type)));
});

export {}; // NOSONAR - required for module scope with global augmentation typescript:S7787
