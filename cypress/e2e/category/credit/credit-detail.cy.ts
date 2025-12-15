describe('Credit Category Detail Page', () => {
  beforeEach(() => {
    cy.session('login', () => {
      cy.login();
    });

    cy.visit('/balances/list');

    // Navega pelo menu até Credit Category
    cy.contains('Category', { timeout: 10000 }).should('be.visible').click();
    cy.contains('Credit Category', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/creditCategories/list');
  });

  function acessarCreditCategoryDetail(): void {
    cy.get('table').should('exist');
    cy.get('[data-cy="detail-button"]').first().should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/creditCategories/detail');
  }

  it('deve acessar a página de detalhes ao clicar na lupa', () => {
    acessarCreditCategoryDetail();
  });

  it('deve voltar para a lista ao clicar no ícone de lista', () => {
    acessarCreditCategoryDetail();
    cy.get('[data-cy="list-button"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/creditCategories/list');
  });

  it('deve ir para a página de edição ao clicar no ícone de lápis', () => {
    acessarCreditCategoryDetail();
    cy.get('[data-cy="edit-button"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/creditCategories/edit');
  });
});
