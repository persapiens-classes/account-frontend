/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      getDataCy(value: string): Chainable<JQuery<HTMLElement>>;
      setupApiMock(): Chainable<void>;
      maybeSetupApiMock(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('getDataCy', (value: string) => {
  return cy.get(`[data-cy="${value}"]`);
});

/**
 * Setup mock intercepts for all api operations
 * Includes validation for boundary value test cases (OW-01 through OW-06)
 */
Cypress.Commands.add('setupApiMock', () => {
  new AppApiMock().mock();
});

/**
 * Conditionally setup owners mock based on CYPRESS_USE_MOCK env variable
 * If CYPRESS_USE_MOCK=true, will intercept and mock API calls
 * If CYPRESS_USE_MOCK=false or not set, will use real backend
 */
Cypress.Commands.add('maybeSetupApiMock', () => {
  cy.env(['useMock']).then(({ useMock }) => {
    if (useMock) {
      cy.log('Using mocked API data');
      cy.setupApiMock();
    } else {
      cy.log('Using real backend for API');
    }
  });
});

// Import commands from each feature module
import './commands/auth';
import './commands/owners';
import { AppApiMock } from './app-api-mock';

export {}; // NOSONAR - Required for TypeScript to treat file as module for global augmentation
