describe('Equity Category Detail Page', () => {
  beforeEach(() => {
    cy.session('login', () => {
      cy.login();
    });

    cy.visit('/balances/list');

    // Navega pelo menu até Equity Category
    cy.contains('Category', { timeout: 10000 }).should('be.visible').click();
    cy.contains('Equity Category', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/equityCategories/list');
  });

  function acessarEquityCategoryDetail(): void {
    cy.get('table').should('exist');
    cy.get('p-button[icon="pi pi-search"]').first().should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/equityCategories/detail');
  }

  it('deve acessar a página de detalhes ao clicar na lupa', () => {
    acessarEquityCategoryDetail();
  });

  it('deve voltar para a lista ao clicar no ícone de lista', () => {
    acessarEquityCategoryDetail();
    cy.get('p-button[icon="pi pi-list"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/equityCategories/list');
  });

  it('deve ir para a página de edição ao clicar no ícone de lápis', () => {
    acessarEquityCategoryDetail();
    cy.get('p-button[icon="pi pi-pencil"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/equityCategories/edit');
  });
});
