/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      setupCategoriesMock(): Chainable<void>;
      maybeSetupCategoriesMock(): Chainable<void>;
    }
  }
}

/**
 * Setup categories mock intercepts for category endpoints
 * Provides mock data for credit, debit, and equity categories
 */
Cypress.Commands.add('setupCategoriesMock', () => {
  cy.fixture('categories').then((categoriesData) => {
    // Intercept all category types: creditCategories, debitCategories, equityCategories
    const categoriesEndpointRegex = /.*Categories$/;

    // Mock GET - list all categories by type
    cy.intercept('GET', categoriesEndpointRegex, (req) => {
      const url = req.url;
      let categoryType = 'credit'; // default

      if (url.includes('debitCategories')) {
        categoryType = 'debit';
      } else if (url.includes('equityCategories')) {
        categoryType = 'equity';
      } else if (url.includes('creditCategories')) {
        categoryType = 'credit';
      }

      const categories = categoriesData[`${categoryType}Categories`] || [];
      req.reply({
        statusCode: 200,
        body: categories,
      });
    }).as('getCategories');

    // Mock GET - get single category
    cy.intercept('GET', /.*(credit|debit|equity)Categories\/.*/, (req) => {
      const categoryName = req.url.split('/').pop();
      req.reply({
        statusCode: 200,
        body: {
          description: categoryName,
        },
      });
    }).as('getCategoryDetail');
  });
});

/**
 * Conditionally setup categories mock based on CYPRESS_USE_MOCK env variable
 * If CYPRESS_USE_MOCK=true, will intercept and mock API calls
 * If CYPRESS_USE_MOCK=false or not set, will use real backend
 */
Cypress.Commands.add('maybeSetupCategoriesMock', () => {
  const useMock = Cypress.env('useMock');

  if (useMock) {
    cy.log('Using mocked categories data');
    cy.setupCategoriesMock();
  } else {
    cy.log('Using real backend for categories');
  }
});

export {};
