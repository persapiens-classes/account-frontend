/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      setupOwnersMock(): Chainable<void>;
      maybeSetupOwnersMock(): Chainable<void>;
    }
  }
}

/**
 * Setup owners mock intercepts for CRUD operations and boundary value analysis
 * Includes validation for boundary value test cases (OW-01 through OW-06)
 */
Cypress.Commands.add('setupOwnersMock', () => {
  cy.fixture('owners').then((ownersData) => {
    const ownersEndpoint = '**/owners';

    // Create a list of existing owners for duplicate check
    const existingOwners = ['Duplicate Owner'];

    // Get or initialize the created owners from Cypress global state
    if (!Cypress.env('createdOwners')) {
      Cypress.env('createdOwners', []);
    }
    const createdOwners = Cypress.env('createdOwners');

    // Mock POST /owners - create a new owner with boundary value validation
    cy.intercept('POST', ownersEndpoint, (req) => {
      const requestBody = req.body;
      const ownerName = requestBody.name;

      // OW-01: Only whitespace (check first)
      if (!ownerName || ownerName.trim() === '') {
        return req.reply({
          statusCode: 400,
          body: {
            error: 'Bad Request',
            message: 'Owner name cannot contain only whitespace',
          },
        });
      }

      // OW-04: Exceeds max length (256+ characters)
      if (ownerName.length > 255) {
        return req.reply({
          statusCode: 400,
          body: {
            error: 'Bad Request',
            message: 'Owner name must not exceed 255 characters',
          },
        });
      }

      // OW-05: Duplicate name
      if (
        existingOwners.includes(ownerName) ||
        createdOwners.some((o: any) => o.name === ownerName)
      ) {
        return req.reply({
          statusCode: 409,
          body: {
            error: 'Conflict',
            message: 'Owner with this name already exists',
          },
        });
      }

      // OW-03: Valid names (3-255 characters)
      // Track the created owner
      createdOwners.push(requestBody);
      Cypress.env('createdOwners', createdOwners);

      req.reply({
        statusCode: 201,
        body: requestBody,
      });
    }).as('createOwner');

    // Mock GET /owners - list all owners (including created ones)
    cy.intercept('GET', ownersEndpoint, (req) => {
      const allOwners = [...ownersData.owners.list, ...createdOwners];
      req.reply({
        statusCode: 200,
        body: allOwners,
      });
    }).as('getOwners');

    // Mock GET /owners/:id - get owner detail (only numeric IDs)
    cy.intercept('GET', /.*\/owners\/\d+$/, (req) => {
      const ownerId = req.url.split('/').pop();
      req.reply({
        statusCode: 200,
        body: {
          name: ownerId,
        },
      });
    }).as('getOwnerDetail');

    // Mock PUT /owners/:id - update owner
    cy.intercept('PUT', `${ownersEndpoint}/*`, (req) => {
      const requestBody = req.body;
      const ownerName = requestBody.name;
      const urlParts = req.url.split('/');
      const currentOwnerId = urlParts[urlParts.length - 1];

      // OW-01: Only whitespace (check first)
      if (!ownerName || ownerName.trim() === '') {
        return req.reply({
          statusCode: 400,
          body: {
            error: 'Bad Request',
            message: 'Owner name cannot contain only whitespace',
          },
        });
      }

      // OW-04: Exceeds max length (256+ characters)
      if (ownerName.length > 255) {
        return req.reply({
          statusCode: 400,
          body: {
            error: 'Bad Request',
            message: 'Owner name must not exceed 255 characters',
          },
        });
      }

      // OW-05: Duplicate name (excluding current owner being edited)
      if (
        (existingOwners.includes(ownerName) && ownerName !== currentOwnerId) ||
        createdOwners.some((o: any) => o.name === ownerName && o.name !== currentOwnerId)
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
      const currentCreatedOwners = Cypress.env('createdOwners') || [];
      const index = currentCreatedOwners.findIndex((o: any) => o.name === currentOwnerId);
      if (index > -1) {
        currentCreatedOwners[index] = requestBody;
        Cypress.env('createdOwners', currentCreatedOwners);
      }

      req.reply({
        statusCode: 200,
        body: req.body,
      });
    }).as('updateOwner');

    // Mock DELETE /owners/:id - delete owner
    cy.intercept('DELETE', `${ownersEndpoint}/*`, (req) => {
      // Remove from created owners list if it exists
      const urlParts = req.url.split('/');
      const ownerId = urlParts[urlParts.length - 1];

      const currentCreatedOwners = Cypress.env('createdOwners') || [];
      const index = currentCreatedOwners.findIndex((o: any) => o.name === ownerId);
      if (index > -1) {
        currentCreatedOwners.splice(index, 1);
        Cypress.env('createdOwners', currentCreatedOwners);
      }

      req.reply({
        statusCode: 204,
        body: {},
      });
    }).as('deleteOwner');
  });
});

/**
 * Conditionally setup owners mock based on CYPRESS_USE_MOCK env variable
 * If CYPRESS_USE_MOCK=true, will intercept and mock API calls
 * If CYPRESS_USE_MOCK=false or not set, will use real backend
 */
Cypress.Commands.add('maybeSetupOwnersMock', () => {
  const useMock = Cypress.env('useMock');

  if (useMock) {
    cy.log('Using mocked owners data');
    cy.setupOwnersMock();
  } else {
    cy.log('Using real backend for owners');
  }
});

export {};
