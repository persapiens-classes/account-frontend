describe('Owner Insert Page', () => {
  const validOwnerName = `fabiana_${Date.now()}`; // dynamic name to avoid duplicity

  beforeEach(() => {
    cy.setupAuthMock();
    cy.setupOwnersMock();
    cy.session('login', () => {
      cy.login(); // custom command with environment variables
    });

    cy.visit('/balances/list');

    // Navigate to owner creation page
    cy.contains('Owner', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/owners/list');
    cy.get('[data-cy="create-button"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/owners/new');
  });

  it('allow returning to the list', () => {
    cy.get('[data-cy="list-button"]').should('be.visible').click();
    cy.url().should('include', '/owners/list');
  });

  it('should create a new Owner successfully', () => {
    cy.get('[data-cy="input-name"]').type(validOwnerName);
    cy.get('[data-cy="save-button"]').should('not.be.disabled').click();
    cy.get('[data-cy="app-toast"]').should('be.visible');
    cy.url({ timeout: 10000 }).should('include', '/owners/detail');
  });
});
