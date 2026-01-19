describe('Owner Remove Page', () => {
  const validOwnerName = `fabiana_${Date.now()}`; // unique name
  const createdOwnerName = validOwnerName;

  beforeEach(() => {
    cy.setupAuthMock();
    cy.setupOwnersMock();
    cy.session('login', () => {
      cy.login();
    });

    cy.visit('/balances/list');

    // Navigate to owners list
    cy.contains('Owner', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/owners/list');
  });

  it('should create a new Owner for removal test', () => {
    cy.get('[data-cy="create-button"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/owners/new');

    cy.get('[data-cy="input-name"]').type(validOwnerName);
    cy.get('[data-cy="save-button"]').should('not.be.disabled').click();
    cy.get('[data-cy="app-toast"]').should('be.visible');
    cy.url({ timeout: 10000 }).should('include', '/owners/detail');
  });

  it('should remove the newly created Owner successfully', () => {
    cy.get('input[aria-label="Filter Name"]')
      .should('exist')
      .clear()
      .type(`${createdOwnerName}{enter}`);

    cy.contains('td', createdOwnerName, { timeout: 10000 }).should('be.visible');

    cy.contains('tr', createdOwnerName).find('[data-cy="delete-button"]').click();

    // Wait for confirmation dialog with the confirmation message
    cy.get('body', { timeout: 10000 }).should('contain', 'Are you sure');

    // Click accept button on the dialog
    cy.get('.p-dialog .p-button-danger', { timeout: 10000 }).click();

    // Confirm that the success message appears
    cy.get('[data-cy="app-toast"]', { timeout: 10000 }).should('be.visible');

    // Confirm that it was removed from the list
    cy.contains('td', createdOwnerName, { timeout: 10000 }).should('not.exist');
  });
});
