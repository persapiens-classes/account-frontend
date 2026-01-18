describe('Logout Page', () => {
  beforeEach(() => {
    cy.maybeSetupAuthMock();

    cy.session('login', () => {
      cy.login();
    });

    cy.visit('/balances/list');
  });

  it('should display login page after logout', () => {
    cy.get('[data-cy="logout-button"]').click();

    // Validates that it is on the login page
    cy.url({ timeout: 10000 }).should('include', '/login');
    cy.get('[data-cy="login-username"]').should('exist');
    cy.get('[data-cy="login-password"]').should('exist');
    cy.get('[data-cy="login-button"]').should('exist');
  });

  it('should not be able to access protected pages after logout', () => {
    cy.get('[data-cy="logout-button"]').click();
    cy.url({ timeout: 10000 }).should('include', '/login');

    // Tries to access a protected page
    cy.visit('/balances/list');

    // Should be redirected to login
    cy.url({ timeout: 10000 }).should('include', '/login');
  });
});
