describe('Owner Detail Page', () => {
  beforeEach(() => {
    // Reset created owners state for mock
    Cypress.env('createdOwners', []);

    cy.session('login', () => {
      cy.maybeSetupAuthMock();
      cy.login();
    });

    cy.maybeSetupOwnersMock();
    cy.visit('/balances/list');

    // Navigate to owners list
    cy.contains('Owner', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/owners/list');
  });

  function accessOwnerDetail(): void {
    cy.get('[data-cy="owners-table"]').should('exist');
    cy.get('[data-cy="detail-button"]').first().should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/owners/detail');
  }

  it('should access detail page when clicking magnifying glass', () => {
    accessOwnerDetail();
  });

  it('should go back to list when clicking list icon', () => {
    accessOwnerDetail();
    cy.get('[data-cy="list-button"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/owners/list');
  });

  it('should go to edit page when clicking pencil icon', () => {
    accessOwnerDetail();
    cy.get('[data-cy="edit-button"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/owners/edit');
  });
});
