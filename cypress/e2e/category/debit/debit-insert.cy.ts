describe('Debit Category Insert Page', () => {
  const validDebitCategoryName = `debit_${Date.now()}`;

  beforeEach(() => {
    cy.session('login', () => {
      cy.visit('/login');
      cy.get('[data-cy="login-username"]').type('persapiens');
      cy.get('[data-cy="login-password"]').type('account');
      cy.get('[data-cy="login-button"]').click();
      cy.url({ timeout: 10000 }).should('include', '/balances/list');
    });

    cy.visit('/balances/list');

    // Navega pelo menu até Debit Categories
    cy.contains('Category', { timeout: 10000 }).should('be.visible').click();
    cy.contains('Debit Category', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/debitCategories/list');

    // Abre a página de criação
    cy.get('p-button[icon="pi pi-plus"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/debitCategories/new');
  });

  it('permitir voltar para a lista', () => {
    cy.get('[data-cy="input-description"]', { timeout: 10000 }).should('be.visible');
    cy.get('p-button[icon="pi pi-list"]').should('be.visible').click();
    cy.url().should('include', '/debitCategories/list');
  });

  it('deve criar uma nova Debit Category com sucesso', () => {
    cy.get('[data-cy="input-description"]').type(validDebitCategoryName);
    cy.get('p-button[icon="pi pi-check"]').should('not.be.disabled').click();
    cy.contains('Debit Category inserted', { timeout: 10000 }).should('exist');
    cy.url({ timeout: 10000 }).should('include', '/debitCategories/detail');
  });
});
