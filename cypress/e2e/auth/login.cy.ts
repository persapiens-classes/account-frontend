describe('LoginPage', () => {
  beforeEach(() => {
    // Setup mock if configured
    cy.maybeSetupAuthMock();
    cy.visit('/login');
  });

  it('should login with valid username and password', () => {
    cy.env(['validUsername', 'validPassword']).then(({ validUsername, validPassword }) => {
      cy.get('[data-cy="login-username"]').type(validUsername);
      cy.get('[data-cy="login-password"]').type(validPassword);
    });
    cy.get('[data-cy="login-button"]').click();

    cy.url().should('include', '/balances/list');
    cy.get('[data-cy="menu-balance"]').should('exist');
  });

  it('should display error with invalid credentials', () => {
    // Setup specific mock for invalid scenario if using mocks
    cy.env(['useMock']).then(({ useMock }) => {
      if (useMock) {
        cy.setupAuthMock('invalid');
      }
    });

    cy.get('[data-cy="login-username"]').type('wronguser');
    cy.get('[data-cy="login-password"]').type('123');
    cy.get('[data-cy="login-button"]').click();

    cy.get('[data-cy="error-toast"]').should('be.visible');
  });
});
