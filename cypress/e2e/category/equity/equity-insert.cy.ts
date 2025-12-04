describe('Equity Category Insert Page', () => {
  const validEquityCategoryName = `equity_${Date.now()}`;

  beforeEach(() => {
    cy.session('login', () => {
      cy.login();
    });

    cy.visit('/balances/list');

    // Navega pelo menu até Equity Categories
    cy.contains('Category', { timeout: 10000 }).should('be.visible').click();
    cy.contains('Equity Category', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/equityCategories/list');

    // Abre a página de criação
    cy.get('p-button[icon="pi pi-plus"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/equityCategories/new');
  });

  it('permitir voltar para a lista', () => {
    cy.get('[data-cy="input-description"]', { timeout: 10000 }).should('be.visible');
    cy.get('p-button[icon="pi pi-list"]').should('be.visible').click();
    cy.url().should('include', '/equityCategories/list');
  });

  it('deve criar uma nova Equity Category com sucesso', () => {
    cy.get('[data-cy="input-description"]').type(validEquityCategoryName);
    cy.get('p-button[icon="pi pi-check"]').should('not.be.disabled').click();
    cy.get('[data-cy="app-toast"]').should('be.visible');
    cy.url({ timeout: 10000 }).should('include', '/equityCategories/detail');
  });
});
