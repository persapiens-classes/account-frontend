describe('Credit Category Insert Page', () => {
  const validCreditCategoryName = `credit_${Date.now()}`;

  beforeEach(() => {
    cy.session('login', () => {
      cy.visit('/login');
      cy.get('[data-cy="login-username"]').type('persapiens');
      cy.get('[data-cy="login-password"]').type('account');
      cy.get('[data-cy="login-button"]').click();
      cy.url({ timeout: 10000 }).should('include', '/balances/list');
    });

    cy.visit('/balances/list');

    // Navega pelo menu até Credit Categories
    cy.contains('Category', { timeout: 10000 }).should('be.visible').click();
    cy.contains('Credit Category', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/creditCategories/list');

    // Abre a página de criação
    cy.get('p-button[icon="pi pi-plus"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/creditCategories/new');
  });

  it('permitir voltar para a lista', () => {
    cy.get('[data-cy="input-description"]', { timeout: 10000 }).should('be.visible');
    cy.get('p-button[icon="pi pi-list"]').should('be.visible').click();
    cy.url().should('include', '/creditCategories/list');
  });

  it('deve criar uma nova Credit Category com sucesso', () => {
    cy.get('[data-cy="input-description"]').type(validCreditCategoryName);
    cy.get('p-button[icon="pi pi-check"]').should('not.be.disabled').click();
    cy.contains('Credit Category inserted', { timeout: 10000 }).should('exist');
    cy.url({ timeout: 10000 }).should('include', '/creditCategories/detail');
  });
});
