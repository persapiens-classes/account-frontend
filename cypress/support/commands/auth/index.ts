/// <reference types="cypress" />

import { listPath, loginPath, PATHS } from '../../../../src/app/app.paths';

declare global {
  namespace Cypress {
    interface Chainable {
      login(username?: string, password?: string): Chainable<void>;
    }
  }
}

/**
 * Custom command to perform login in tests
 * Uses Cypress environment variables
 */
Cypress.Commands.add('login', (username?: string, password?: string) => {
  cy.visit(loginPath());
  cy.env(['validUsername', 'validPassword']).then(({ validUsername, validPassword }) => {
    const user = username ?? validUsername;
    const pass = password ?? validPassword;

    cy.getDataCy('login-username').type(user);
    cy.getDataCy('login-password').type(pass);
  });
  cy.getDataCy('login-button').click();
  cy.url().should('include', listPath(PATHS.BALANCE_PATH));
});

export {}; // NOSONAR - required for module scope with global augmentation typescript:S7787
