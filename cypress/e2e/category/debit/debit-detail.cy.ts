describe('Debit Category Detail Page', () => {
  beforeEach(() => {
    cy.session('login', () => {
      cy.login();
    });

    cy.visit('/balances/list');

    // Navega pelo menu até Debit Category
    cy.contains('Category', { timeout: 10000 }).should('be.visible').click();
    cy.contains('Debit Category', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/debitCategories/list');
  });

  function acessarDebitCategoryDetail(): void {
    cy.get('table').should('exist');
    cy.get('[data-cy="detail-button"]').first().should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/debitCategories/detail');
  }

  it('deve acessar a página de detalhes ao clicar na lupa', () => {
    acessarDebitCategoryDetail();
  });

  it('deve voltar para a lista ao clicar no ícone de lista', () => {
    acessarDebitCategoryDetail();
    cy.get('[data-cy="list-button"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/debitCategories/list');
  });

  it('deve ir para a página de edição ao clicar no ícone de lápis', () => {
    acessarDebitCategoryDetail();
    cy.get('[data-cy="edit-button"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/debitCategories/edit');
  });
});
