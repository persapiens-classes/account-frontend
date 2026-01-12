describe('LoginPage', () => {
  const validUsername = Cypress.env('validUsername');
  const validPassword = Cypress.env('validPassword');

  beforeEach(() => {
    cy.visit('/login');
  });

  it('should login with valid username and password', () => {
    cy.get('[data-cy="login-username"]').type(validUsername);
    cy.get('[data-cy="login-password"]').type(validPassword);
    cy.get('[data-cy="login-button"]').click();
    cy.url().should('include', '/balances/list');
    cy.contains('Balance').should('exist');
  });

  it('should display error with invalid credentials', () => {
    cy.get('[data-cy="login-username"]').type('errado');
    cy.get('[data-cy="login-password"]').type('123');
    cy.get('[data-cy="login-button"]').click();
    cy.get('[data-cy="error-toast"]').should('be.visible');
  });
});
