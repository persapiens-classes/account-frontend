describe('Logout Page', () => {
  beforeEach(() => {
    cy.maybeSetupApiMock();
    cy.login();
  });

  it('should display login page after logout', () => {
    cy.getDataCy('logout-button').click();
    cy.wait('@logoutRequest');

    // Validates that it is on the login page
    cy.url().should('include', '/login');
    cy.getDataCy('login-username').should('exist');
    cy.getDataCy('login-password').should('exist');
    cy.getDataCy('login-button').should('exist');
  });

  it('should not be able to access protected pages after logout', () => {
    cy.getDataCy('logout-button').click();
    cy.wait('@logoutRequest');
    cy.url().should('include', '/login');

    // Tries to access a protected page
    cy.visit('/balances/list');

    // Should be redirected to login
    cy.url().should('include', '/login');
  });
});
