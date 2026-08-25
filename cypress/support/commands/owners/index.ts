/// <reference types="cypress" />

import { OwnersData } from '../../../e2e/owners/owner-fixture-models';

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

interface Owner {
  name: string;
}

interface OwnerValidationError {
  statusCode: 400;
  body: {
    error: 'Bad Request';
    message: string;
  };
}

class ModelApiMock<T, ID> {
  private endpoint: string;
  private idFn: (model: T) => ID;
  private models: T[];
  private idBlockInsertUpdate: boolean;
  constructor(
    endpoint: string,
    idFn: (model: T) => ID,
    idBlockInsertUpdate: boolean,
    models?: T[],
  ) {
    this.endpoint = endpoint;
    this.idFn = idFn;
    this.models = models || [];
    this.idBlockInsertUpdate = idBlockInsertUpdate;
  }

  private mockGetAll() {
    // Mock GET /owners - list all owners (including created ones)
    cy.intercept('GET', `**/${this.endpoint}`, (req) => {
      req.reply({
        statusCode: 200,
        body: this.models,
      });
    }).as(`${this.endpoint}-getAll`);
  }

  private mockDelete() {
    // Mock DELETE /owners/:id - delete owner
    cy.intercept('DELETE', `${this.endpoint}/*`, (req) => {
      // Remove from created models list if it exists
      const urlParts = req.url.split('/');
      const modelId = urlParts.at(-1) ?? '';

      const index = this.models.findIndex((model) => this.idFn(model) === modelId);
      if (index > -1) {
        this.models.splice(index, 1);
      }

      req.reply({
        statusCode: 204,
        body: {},
      });
    }).as(`${this.endpoint}-delete`);
  }

  private getOwnerValidationError = (
      ownerName: string | undefined,
    ): OwnerValidationError | null => {
      // OW-01: Only whitespace (check first)
      if (!ownerName || ownerName.trim() === '') {
        return {
          statusCode: 400,
          body: {
            error: 'Bad Request',
            message: 'Owner name cannot contain only whitespace',
          },
        };
      }

      // OW-04: Exceeds max length (256+ characters)
      if (ownerName.length > 255) {
        return {
          statusCode: 400,
          body: {
            error: 'Bad Request',
            message: 'Owner name must not exceed 255 characters',
          },
        };
      }

      return null;
    };

  private mockPost() {
    // Mock POST /owners - create a new owner with boundary value validation
    cy.intercept('POST', `${this.endpoint}`, (req) => {
      const requestBody = req.body;
      const ownerName = requestBody.name;

      const ownerValidationError = this.getOwnerValidationError(ownerName);
      if (ownerValidationError) {
        return req.reply(ownerValidationError);
      }

      // OW-05: Duplicate name
      if (this.idBlockInsertUpdate) {
        if (this.models.some((o: T) => this.idFn(o) === this.idFn(requestBody))) {
          return req.reply({
            statusCode: 409,
            body: {
              error: 'Conflict',
              message: 'Owner with this name already exists',
            },
          });
        }
      }

      // OW-03: Valid names (3-255 characters)
      // Track the created owner
      this.models.push(requestBody);

      req.reply({
        statusCode: 201,
        body: requestBody,
      });
    }).as(`${this.endpoint}-post`);
  }

  private mockPut() {
    // Mock PUT /owners/:id - update owner
    cy.intercept('PUT', `${this.endpoint}/*`, (req) => {
      const requestBody = req.body;
      const ownerName = requestBody.name;
      const urlParts = req.url.split('/');
      const currentOwnerId = urlParts.at(-1) ?? '';

      const ownerValidationError = this.getOwnerValidationError(ownerName);
      if (ownerValidationError) {
        return req.reply(ownerValidationError);
      }

      // OW-05: Duplicate name (excluding current owner being edited)
      if (this.idBlockInsertUpdate) {
      if (
        this.models.some((o: T) => this.idFn(o) === this.idFn(requestBody) && o.name === ownerName && o.name !== currentOwnerId)
      ) {
        return req.reply({
          statusCode: 409,
          body: {
            error: 'Conflict',
            message: 'Owner with this name already exists',
          },
        });
      }

      // Update the owner in createdOwners list
      const ownerExists = this.models.some((o: T) => o.name === currentOwnerId);
      if (ownerExists) {
        const updatedOwners = this.models.map((o: T) =>
          o.name === currentOwnerId ? requestBody : o,
        );
        this.models.splice(0, this.models.length, ...updatedOwners);
      }

      req.reply({
        statusCode: 200,
        body: req.body,
      });
    }).as(`${this.endpoint}-put`);
  }

  mock() {
    this.mockGetAll();
    this.mockDelete();
    this.mockPost();
    this.mockPut();
  }
}

/**
 * Setup owners mock intercepts for CRUD operations and boundary value analysis
 * Includes validation for boundary value test cases (OW-01 through OW-06)
 */
Cypress.Commands.add('setupOwnersMock', () => {
  cy.fixture<OwnersData>('owners').then((ownersData) => {
    const ownersEndpoint = '**/owners';

    const modelApiMock = new ModelApiMock<Owner, string>(
      ownersEndpoint,
      (model) => model.name,
      true,
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
