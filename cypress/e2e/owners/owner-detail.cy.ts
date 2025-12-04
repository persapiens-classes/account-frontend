describe('Owner Detail Page', () => {
  beforeEach(() => {
    cy.session('login', () => {
      cy.login();
    });
    cy.visit('/balances/list');

    // Navega para lista de owners
    cy.contains('Owner', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/owners/list');
  });

  function acessarOwnerDetail(): void {
    cy.get('table').should('exist');
    cy.get('p-button[icon="pi pi-search"]').first().should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/owners/detail');
  }

  it('deve acessar a página de detalhes ao clicar na lupa', () => {
    acessarOwnerDetail();
  });

  it('deve voltar para a lista ao clicar no ícone de lista', () => {
    acessarOwnerDetail();
    cy.get('p-button[icon="pi pi-list"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/owners/list');
  });

  it('deve ir para a página de edição ao clicar no ícone de lápis', () => {
    acessarOwnerDetail();
    cy.get('p-button[icon="pi pi-pencil"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/owners/edit');
  });
});
