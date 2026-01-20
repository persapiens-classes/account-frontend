describe('Owner Remove Page (Mock)', () => {
  const validOwnerName = `fabiana_${Date.now()}`; // unique name
  const createdOwnerName = validOwnerName;

  beforeEach(() => {
    cy.session('login', () => {
      cy.setupAuthMock('success');
      cy.login();
    });

    cy.setupOwnersMock();
    cy.visit('/owners/new');
  });

  it('should create a new Owner for removal test', () => {
    cy.url().should('include', '/owners/new');

    cy.get('[data-cy="input-name"]').type(validOwnerName);
    cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

    cy.wait('@createOwner').its('response.statusCode').should('eq', 201);

    cy.get('[data-cy="app-toast"]').should('be.visible');
    cy.url({ timeout: 10000 }).should('include', '/owners/detail');
  });

  it('should remove the recently created Owner successfully', () => {
    cy.visit('/owners/list');

    cy.get('[data-cy="filter-name"]').should('exist').clear().type(`${createdOwnerName}{enter}`);

    cy.contains('td', createdOwnerName, { timeout: 10000 }).should('be.visible');

    cy.contains('tr', createdOwnerName).within(() => {
      cy.get('[data-cy="delete-button"]').should('be.visible').click({ force: true });
    });

    // Wait for confirmation dialog
    cy.get('[data-cy="remove-confirm-dialog"]', { timeout: 10000 }).should('be.visible');

    // Click accept button on the dialog
    cy.get('.p-dialog .p-button-danger', { timeout: 10000 }).click();

    cy.wait('@deleteOwner').its('response.statusCode').should('eq', 204);

    // Confirm that the success message appears
    cy.get('[data-cy="app-toast"]', { timeout: 10000 }).should('be.visible');

    // Confirm removal
    cy.contains('td', createdOwnerName, { timeout: 10000 }).should('not.exist');
  });
});
