/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(username?: string, password?: string): Chainable<void>;
      setupAuthMock(scenario?: 'success' | 'invalid'): Chainable<void>;
      maybeSetupAuthMock(): Chainable<void>;
      setAuthState(isAuthenticated: boolean): Chainable<void>;
      visitMain(): Chainable<void>;
    }
  }
}

let isAuthenticated = false;

/**
 * Setup authentication mock intercepts based on scenario
 * @param scenario - 'success' for valid login, 'invalid' for failed login
 */
Cypress.Commands.add('setupAuthMock', (scenario: 'success' | 'invalid' = 'success') => {
  cy.fixture('auth').then((authData) => {
    const loginEndpoint = '**/auth/login';
    const meEndpoint = '**/auth/me';
    const logoutEndpoint = '**/auth/logout';

    if (scenario === 'success') {
      cy.intercept('POST', loginEndpoint, (req) => {
        isAuthenticated = true;
        req.reply({
          statusCode: 200,
          body: authData.login.success,
        });
      }).as('loginRequest');

      cy.intercept('GET', meEndpoint, (req) => {
        if (!isAuthenticated) {
          return req.reply({
            statusCode: 401,
            body: authData.login.invalid,
          });
        }

        return req.reply({
          statusCode: 200,
          body: authData.login.success,
        });
      }).as('meRequest');

      cy.intercept('POST', logoutEndpoint, (req) => {
        isAuthenticated = false;
        req.reply({
          statusCode: 200,
          body: {},
        });
      }).as('logoutRequest');

      // Mock the balances API endpoint
      cy.intercept('GET', '**/balances', {
        statusCode: 200,
        body: authData.balances.list,
      }).as('getBalances');
    } else {
      cy.intercept('POST', loginEndpoint, {
        statusCode: 401,
        body: authData.login.invalid,
      }).as('loginRequest');

      cy.intercept('GET', meEndpoint, {
        statusCode: 401,
        body: authData.login.invalid,
      }).as('meRequest');

      cy.intercept('POST', logoutEndpoint, (req) => {
        isAuthenticated = false;
        req.reply({
          statusCode: 200,
          body: {},
        });
      }).as('logoutRequest');
    }
  });
});

/**
 * Conditionally setup auth mock based on CYPRESS_USE_MOCK env variable
 * If CYPRESS_USE_MOCK=true, will intercept and mock API calls
 * If CYPRESS_USE_MOCK=false or not set, will use real backend
 */
Cypress.Commands.add('maybeSetupAuthMock', () => {
  cy.env(['useMock']).then(({ useMock }) => {
    if (useMock) {
      cy.log('Using mocked data');
      cy.setupAuthMock('success');
    } else {
      cy.log('Using real backend');
    }
  });
});

/**
 * Custom command to perform login in tests
 * Uses Cypress environment variables
 */
Cypress.Commands.add('login', (username?: string, password?: string) => {
  const user = username ?? Cypress.env('validUsername');
  const pass = password ?? Cypress.env('validPassword');

  cy.visit('/login');
  cy.get('[data-cy="login-username"]').type(user);
  cy.get('[data-cy="login-password"]').type(pass);
  cy.get('[data-cy="login-button"]').click();
  cy.url().should('include', '/balances/list');
});

/**
 * Custom command to visit main page
 */
Cypress.Commands.add('visitMain', () => {
  cy.visit('/balances/list');
});

Cypress.Commands.add('setAuthState', (value: boolean) => {
  isAuthenticated = value;
});

export {};
