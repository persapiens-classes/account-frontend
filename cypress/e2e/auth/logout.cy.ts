describe('Logout Page', () => {
  beforeEach(() => {
    cy.session('login', () => {
      cy.login();
    });

    cy.visit('/balances/list');
  });

  it('deve exibir página de login após logout', () => {
    cy.get('[data-cy="logout-button"]').click();

    // Valida que está na página de login
    cy.url({ timeout: 10000 }).should('include', '/login');
    cy.get('[data-cy="login-username"]').should('exist');
    cy.get('[data-cy="login-password"]').should('exist');
    cy.get('[data-cy="login-button"]').should('exist');
  });

  it('não deve conseguir acessar páginas protegidas após logout', () => {
    cy.get('[data-cy="logout-button"]').click();
    cy.url({ timeout: 10000 }).should('include', '/login');

    // Tenta acessar uma página protegida
    cy.visit('/balances/list');

    // Deve ser redirecionado para login
    cy.url({ timeout: 10000 }).should('include', '/login');
  });
});
