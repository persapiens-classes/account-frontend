/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      setupAccountsMock(): Chainable<void>;
      maybeSetupAccountsMock(): Chainable<void>;
      navigateToAccountList(accountType: 'credit' | 'debit' | 'equity'): Chainable<void>;
    }
  }
}

/**
 * Setup accounts mock intercepts for CRUD operations and boundary value analysis
 * Includes validation for boundary value test cases (AC-01 through AC-06)
 */
Cypress.Commands.add('setupAccountsMock', () => {
  cy.fixture('accounts').then((accountsData) => {
    // Intercept all account types: creditAccounts, debitAccounts, equityAccounts
    // Using regex to match any URL ending with Accounts
    const accountsEndpointRegex = /.*Accounts$/;

    // Get or initialize the created accounts from Cypress global state
    if (!Cypress.env('createdAccounts')) {
      Cypress.env('createdAccounts', []);
    }
    const createdAccounts = Cypress.env('createdAccounts');

    // Define valid categories
    const validCategories = ['Category 1', 'Category 2', 'Category 3'];

    // Mock POST - create a new account with boundary value validation
    cy.intercept('POST', accountsEndpointRegex, (req) => {
      const requestBody = req.body;
      const description = requestBody.description;
      const category = requestBody.category;

      // AC-01: Empty description
      if (!description || description.trim() === '') {
        return req.reply({
          statusCode: 400,
          body: {
            error: 'Bad Request',
            message: 'Account description cannot be empty',
          },
        });
      }

      // AC-04: Exceeds max length (256+ characters)
      if (description.length > 255) {
        return req.reply({
          statusCode: 400,
          body: {
            error: 'Bad Request',
            message: 'Account description must not exceed 255 characters',
          },
        });
      }

      // AC-05: Empty category
      if (!category || category.trim() === '') {
        return req.reply({
          statusCode: 400,
          body: {
            error: 'Bad Request',
            message: 'Account category cannot be empty',
          },
        });
      }

      // AC-06: Invalid/non-existent category
      if (!validCategories.includes(category)) {
        return req.reply({
          statusCode: 404,
          body: {
            error: 'Not Found',
            message: 'Category does not exist',
          },
        });
      }

      // AC-02, AC-03, AC-05: Valid descriptions and categories
      // Track the created account
      createdAccounts.push(requestBody);
      Cypress.env('createdAccounts', createdAccounts);

      req.reply({
        statusCode: 201,
        body: requestBody,
      });
    }).as('createAccount');

    // Mock GET - list all accounts (including created ones)
    cy.intercept('GET', accountsEndpointRegex, (req) => {
      const allAccounts = [...accountsData.accounts.list, ...createdAccounts];
      req.reply({
        statusCode: 200,
        body: allAccounts,
      });
    }).as('getAccounts');

    // Mock GET /(credit|debit|equity)Accounts/:id - get account detail
    cy.intercept('GET', /.*(credit|debit|equity)Accounts\/\d+$/, (req) => {
      const accountId = req.url.split('/').pop();
      req.reply({
        statusCode: 200,
        body: {
          description: accountId,
          category: 'Category 1',
        },
      });
    }).as('getAccountDetail');

    // Mock PUT - update account
    cy.intercept('PUT', /.*(credit|debit|equity)Accounts\/\d+$/, (req) => {
      const requestBody = req.body;
      const description = requestBody.description;
      const category = requestBody.category;
      const urlParts = req.url.split('/');
      const currentAccountId = urlParts[urlParts.length - 1];

      // AC-01: Empty description
      if (!description || description.trim() === '') {
        return req.reply({
          statusCode: 400,
          body: {
            error: 'Bad Request',
            message: 'Account description cannot be empty',
          },
        });
      }

      // AC-04: Exceeds max length (256+ characters)
      if (description.length > 255) {
        return req.reply({
          statusCode: 400,
          body: {
            error: 'Bad Request',
            message: 'Account description must not exceed 255 characters',
          },
        });
      }

      // AC-05: Empty category
      if (!category || category.trim() === '') {
        return req.reply({
          statusCode: 400,
          body: {
            error: 'Bad Request',
            message: 'Account category cannot be empty',
          },
        });
      }

      // AC-06: Invalid/non-existent category
      if (!validCategories.includes(category)) {
        return req.reply({
          statusCode: 404,
          body: {
            error: 'Not Found',
            message: 'Category does not exist',
          },
        });
      }

      // Update the account in createdAccounts list
      const currentCreatedAccounts = Cypress.env('createdAccounts') || [];
      const index = currentCreatedAccounts.findIndex(
        (a: any) => a.description === currentAccountId,
      );
      if (index > -1) {
        currentCreatedAccounts[index] = requestBody;
        Cypress.env('createdAccounts', currentCreatedAccounts);
      }

      req.reply({
        statusCode: 200,
        body: { ...req.body, id: currentAccountId },
      });
    }).as('updateAccount');

    // Mock DELETE - delete account
    cy.intercept('DELETE', /.*(credit|debit|equity)Accounts\/\d+$/, (req) => {
      // Remove from created accounts list if it exists
      const urlParts = req.url.split('/');
      const accountId = urlParts[urlParts.length - 1];

      const currentCreatedAccounts = Cypress.env('createdAccounts') || [];
      const index = currentCreatedAccounts.findIndex((a: any) => a.description === accountId);
      if (index > -1) {
        currentCreatedAccounts.splice(index, 1);
        Cypress.env('createdAccounts', currentCreatedAccounts);
      }

      req.reply({
        statusCode: 204,
        body: {},
      });
    }).as('deleteAccount');
  });
});

/**
 * Conditionally setup accounts mock based on CYPRESS_USE_MOCK env variable
 * If CYPRESS_USE_MOCK=true, will intercept and mock API calls
 * If CYPRESS_USE_MOCK=false or not set, will use real backend
 */
Cypress.Commands.add('maybeSetupAccountsMock', () => {
  const useMock = Cypress.env('useMock');

  if (useMock) {
    cy.log('Using mocked accounts data');
    cy.setupAccountsMock();
  } else {
    cy.log('Using real backend for accounts');
  }
});

/**
 * Navigate to account list by type (credit, debit, or equity)
 * Uses direct URL navigation when possible, with fallback to menu navigation
 */
Cypress.Commands.add('navigateToAccountList', (accountType: 'credit' | 'debit' | 'equity') => {
  const routeMap = {
    credit: '/creditAccounts/list',
    debit: '/debitAccounts/list',
    equity: '/equityAccounts/list',
  };

  const labelMap = {
    credit: 'Credit Account',
    debit: 'Debit Account',
    equity: 'Equity Account',
  };

  // Navigate directly via URL (more reliable than UI navigation)
  cy.visit(routeMap[accountType]);

  // Verify we're on the correct page
  cy.url({ timeout: 10000 }).should('include', routeMap[accountType]);

  // Wait for table to load
  cy.get('[data-cy="accounts-table"]', { timeout: 10000 }).should('exist');
});

export {};
