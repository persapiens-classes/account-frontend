/// <reference types="cypress" />

import { Owner } from '../../../../src/app/owner/owner';
import { OwnersData } from '../../../e2e/owners/owner-fixture-models';
import { ModelApiMock } from '../../mock-api-model';

declare global {
  namespace Cypress {
    interface Chainable {
      setupOwnersMock(): Chainable<void>;
      maybeSetupOwnersMock(): Chainable<void>;
      navigateToOwnersList(): Chainable<void>;
      navigateToOwnersNew(): Chainable<void>;
    }
  }
}

/**
 * Setup owners mock intercepts for CRUD operations and boundary value analysis
 * Includes validation for boundary value test cases (OW-01 through OW-06)
 */
Cypress.Commands.add('setupOwnersMock', () => {
  cy.fixture<OwnersData>('owners').then((ownersData: OwnersData) => {
    const ownersEndpoint = '**/owners';

    const idFn = (model: Owner): string => model.name;

    const validateOwner = (owner: Owner | undefined): string | null => {
      console.log('VALIDATING owner:', owner);
      const ownerName = owner?.name;

      console.log('VALIDATING owner name:', ownerName);
      // OW-01: Only whitespace (check first)
      if (!ownerName || ownerName.trim() === '') {
        return 'Owner name cannot contain only whitespace';
      }

      console.log('VALIDATING owner name length:', ownerName.length);
      // OW-04: Exceeds max length (256+ characters)
      if (ownerName.length > 255) {
        return 'Owner name must not exceed 255 characters';
      }

      return null;
    };

    const modelApiMock = new ModelApiMock<Owner, string>(
      ownersEndpoint,
      idFn,
      validateOwner,
      ownersData.owners.list,
    );
    modelApiMock.mock();
  });
});

/**
 * Conditionally setup owners mock based on CYPRESS_USE_MOCK env variable
 * If CYPRESS_USE_MOCK=true, will intercept and mock API calls
 * If CYPRESS_USE_MOCK=false or not set, will use real backend
 */
Cypress.Commands.add('maybeSetupOwnersMock', () => {
  cy.env(['useMock']).then(({ useMock }) => {
    if (useMock) {
      cy.log('Using mocked owners data');
      cy.setupOwnersMock();
    } else {
      cy.log('Using real backend for owners');
    }
  });
});

/**
 * Navigate to owners list page
 */
Cypress.Commands.add('navigateToOwnersList', () => {
  // Navigate to owners list
  cy.getDataCy('menu-owner').should('be.visible').click();
  cy.url().should('include', '/owners/list');
});

/**
 * Navigate to owners new page
 */
Cypress.Commands.add('navigateToOwnersNew', () => {
  // Path to owner creation page
  cy.navigateToOwnersList();
  cy.getDataCy('create-button').should('be.visible').click();
  cy.url().should('include', '/owners/new');
});

export {}; // NOSONAR - required for module scope with global augmentation typescript:S7787
