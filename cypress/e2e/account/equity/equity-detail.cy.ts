describe('Equity Account Detail Page', () => {
  beforeEach(() => {
    cy.session('login', () => {
      cy.login();
    });

    cy.visit('/balances/list');

    // Navega pelo menu até Equity Account
    cy.get('p-menubar').contains('Account', { timeout: 10000 }).should('be.visible').click();
    cy.contains('Equity Account', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/equityAccounts/list');
  });

  function acessarEquityAccountDetail(): void {
    cy.get('table').should('exist');
    cy.get('[data-cy="detail-button"]').first().should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/equityAccounts/detail');
  }

  it('deve acessar a página de detalhes ao clicar na lupa', () => {
    acessarEquityAccountDetail();
  });

  it('deve voltar para a lista ao clicar no ícone de lista', () => {
    acessarEquityAccountDetail();
    cy.get('[data-cy="list-button"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/equityAccounts/list');
  });

  it('deve ir para a página de edição ao clicar no ícone de lápis', () => {
    acessarEquityAccountDetail();
    cy.get('[data-cy="edit-button"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/equityAccounts/edit');
  });
});
