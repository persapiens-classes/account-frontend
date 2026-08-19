import { submitOwnerNameAndVerifyDetailRoute } from './owner-helpers';

describe('Owner Remove Page', () => {
  const validOwnerName = Cypress._.uniqueId('fabiana_'); // unique name
  const createdOwnerName = validOwnerName;

  beforeEach(() => {
    cy.maybeSetupAuthMock();
    cy.login();

    cy.maybeSetupOwnersMock();
  });

  it('should create a new Owner for removal test', () => {
    cy.navigateToOwnersNew();

    submitOwnerNameAndVerifyDetailRoute(() => validOwnerName, false);
  });

  // Reason: not working yet
  it.skip('should remove the recently created Owner successfully', () => {
    cy.navigateToOwnersList();

    cy.get('[data-cy="filter-name"]').should('exist').clear();
    cy.get('[data-cy="filter-name"]').type(`${createdOwnerName}{enter}`);

    cy.contains('td', createdOwnerName).should('be.visible');

    cy.contains('tr', createdOwnerName).within(() => {
      cy.get('[data-cy="delete-button"]').should('be.visible').click();
    });

    // Wait for confirmation dialog
    cy.get('[data-cy="remove-confirm-dialog"]').should('be.visible');

    // Click accept button on the dialog
    cy.get('.p-dialog .p-button-danger').click();

    // Confirm that the success message appears
    cy.get('[data-cy="app-toast"]').should('be.visible');

    // Confirm removal
    cy.contains('td', createdOwnerName).should('not.exist');
  });
});
