describe('Owner Remove Page', () => {
  const validOwnerName = `fabiana_${Date.now()}`; // unique name
  const createdOwnerName = validOwnerName;

  beforeEach(() => {
    // Reset created owners state for mock
    Cypress.env('createdOwners', []);

    cy.session('login', () => {
      cy.maybeSetupAuthMock();
      cy.login();
    });

    cy.maybeSetupOwnersMock();
  });

  it('should create a new Owner for removal test', () => {
    cy.visit('/owners/new');
    cy.url().should('include', '/owners/new');

    cy.get('[data-cy="input-name"]').type(validOwnerName);
    cy.get('[data-cy="save-button"]').should('not.be.disabled').click();
    cy.get('[data-cy="app-toast"]').should('be.visible');
    cy.url().should('include', '/owners/detail');
  });

  it.skip('should remove the recently created Owner successfully', () => {
    cy.visit('/owners/list');

    cy.get('[data-cy="filter-name"]').should('exist').clear().type(`${createdOwnerName}{enter}`);

    cy.contains('td', createdOwnerName).should('be.visible');

    cy.contains('tr', createdOwnerName).within(() => {
      cy.get('[data-cy="delete-button"]').should('be.visible').click({ force: true });
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
