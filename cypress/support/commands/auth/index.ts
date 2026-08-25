/// <reference types="cypress" />

import { StatusCodes } from 'http-status-codes';

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

function interceptPostLogout(logoutEndpoint: string) {
  cy.intercept('POST', logoutEndpoint, (req) => {
    isAuthenticated = false;
    req.reply({
      statusCode: StatusCodes.OK,
      body: {},
    });
  }).as('logoutRequest');
}

/**
 * Setup authentication mock intercepts based on scenario
 * @param scenario - 'success' for valid login, 'invalid' for failed login
 */
Cypress.Commands.add('setupAuthMock', (scenario: 'success' | 'invalid' = 'success') => {
  const loginEndpoint = '**/auth/login';
  const meEndpoint = '**/auth/me';
  const logoutEndpoint = '**/auth/logout';

  const responseInvalid = {
    message: 'Invalid credentials',
    statusCode: 401,
  };

  if (scenario === 'success') {
    const responseSuccess = {
      login: 'persapiens',
      token: 'mock-jwt-token',
      expiresIn: 3600,
    };

    cy.intercept('POST', loginEndpoint, (req) => {
      isAuthenticated = true;
      req.reply({
        statusCode: StatusCodes.OK,
        body: responseSuccess,
      });
    }).as('loginRequest');

    cy.intercept('GET', meEndpoint, (req) => {
      if (!isAuthenticated) {
        return req.reply({
          statusCode: StatusCodes.UNAUTHORIZED,
          body: responseInvalid,
        });
      }

      return req.reply({
        statusCode: StatusCodes.OK,
        body: responseSuccess,
      });
    }).as('meRequest');

    interceptPostLogout(logoutEndpoint);
  } else {
    cy.intercept('POST', loginEndpoint, {
      statusCode: StatusCodes.UNAUTHORIZED,
      body: responseInvalid,
    }).as('loginRequest');

    cy.intercept('GET', meEndpoint, {
      statusCode: StatusCodes.UNAUTHORIZED,
      body: responseInvalid,
    }).as('meRequest');

    interceptPostLogout(logoutEndpoint);
  }
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
  cy.visit('/login');
  cy.env(['validUsername', 'validPassword']).then(({ validUsername, validPassword }) => {
    const user = username ?? validUsername;
    const pass = password ?? validPassword;

    cy.getDataCy('login-username').type(user);
    cy.getDataCy('login-password').type(pass);
  });
  cy.getDataCy('login-button').click();
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

export {}; // NOSONAR - required for module scope with global augmentation typescript:S7787
