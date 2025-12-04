describe('LoginPage', () => {
  const validUsername = Cypress.env('validUsername');
  const validPassword = Cypress.env('validPassword');

  beforeEach(() => {
    cy.visit('/login');
  });

  it('deve logar com usuário e senha válidos', () => {
    cy.get('[data-cy="login-username"]').type(validUsername);
    cy.get('[data-cy="login-password"] input').type(validPassword);
    cy.get('[data-cy="login-button"]').click();
    cy.url().should('include', '/balances/list');
    cy.contains('Balance').should('exist');
  });

  it('deve exibir erro com credenciais inválidas', () => {
    cy.get('[data-cy="login-username"]').type('errado');
    cy.get('[data-cy="login-password"] input').type('123');
    cy.get('[data-cy="login-button"]').click();
    cy.contains('Invalid credenciais, please try again.').should('exist');
  });
});
