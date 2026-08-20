/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      getDataCy(value: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add('getDataCy', (value: string) => {
  return cy.get(`[data-cy="${value}"]`);
});

// Import commands from each feature module
import './commands/auth';
import './commands/owners';

export {}; // NOSONAR - Required for TypeScript to treat file as module for global augmentation
