describe('Debit Category Insert Page', () => {
  const validDebitCategoryName = `debit_${Date.now()}`;

  beforeEach(() => {
    cy.session('login', () => {
      cy.login();
    });

    cy.visit('/balances/list');

    // Navega pelo menu até Debit Categories
    cy.contains('Category', { timeout: 10000 }).should('be.visible').click();
    cy.contains('Debit Category', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/debitCategories/list');

    // Abre a página de criação
    cy.get('[data-cy="create-button"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/debitCategories/new');
  });

  it('permitir voltar para a lista', () => {
    cy.get('[data-cy="input-description"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-cy="list-button"]').should('be.visible').click();
    cy.url().should('include', '/debitCategories/list');
  });

  it('deve criar uma nova Debit Category com sucesso', () => {
    cy.get('[data-cy="input-description"]').type(validDebitCategoryName);
    cy.get('[data-cy="save-button"]').should('not.be.disabled').click();
    cy.get('[data-cy="app-toast"]').should('be.visible');
    cy.url({ timeout: 10000 }).should('include', '/debitCategories/detail');
  });
});
