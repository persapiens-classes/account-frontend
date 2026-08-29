/// <reference types="cypress" />

import { listPath, newPath } from '../../../../src/app/app.paths';
import { Category, CategoryType } from '../../../../src/app/category/category';
import { categoryPath } from '../../../e2e/category/category-helpers';
import { categoriesDefault } from '../../fakers/models-default';

declare global {
  namespace Cypress {
    interface Chainable {
      navigateToCategoryList(type: CategoryType): Chainable<void>;
      navigateToCategoryNew(type: CategoryType): Chainable<void>;
      categoriesDefault(type: CategoryType): Chainable<Category[]>;
    }
  }
}

/**
 * Navigate to category list page
 */
Cypress.Commands.add('navigateToCategoryList', (type) => {
  cy.getDataCy(`menu-category`).should('be.visible').click();
  cy.getDataCy(`menu-category-${type.toLowerCase()}`).should('be.visible').click();
  cy.url().should('include', listPath(categoryPath(type)));
});

/**
 * Navigate to category new page
 */
Cypress.Commands.add('navigateToCategoryNew', (type) => {
  // Path to category creation page
  cy.navigateToCategoryList(type);
  cy.getDataCy('create-button').should('be.visible').click();
  cy.url().should('include', newPath(categoryPath(type)));
});

Cypress.Commands.add('categoriesDefault', (type: CategoryType) => {
  return cy.wrap(categoriesDefault(type));
});

export {}; // NOSONAR - required for module scope with global augmentation typescript:S7787
