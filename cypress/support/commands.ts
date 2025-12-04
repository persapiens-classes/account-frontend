/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(username?: string, password?: string): Chainable<void>;
    }
  }
}

/**
 * Comando customizado para fazer login nos testes
 * Usa variáveis de ambiente do Cypress
 */
Cypress.Commands.add('login', (username?: string, password?: string) => {
  const user = username || Cypress.env('validUsername');
  const pass = password || Cypress.env('validPassword');

  cy.visit('/login');
  cy.get('[data-cy="login-username"]').type(user);
  cy.get('[data-cy="login-password"]').type(pass);
  cy.get('[data-cy="login-button"]').click();
  cy.url().should('include', '/balances/list');
});

export {};
