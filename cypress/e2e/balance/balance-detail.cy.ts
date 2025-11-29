describe('Balance Detail Page', () => {
  beforeEach(() => {
    cy.session('login', () => {
      cy.visit('/login');
      cy.get('[data-cy="login-username"]').type('persapiens');
      cy.get('[data-cy="login-password"]').type('account');
      cy.get('[data-cy="login-button"]').click();
      cy.url({ timeout: 10000 }).should('include', '/balances/list');
    });
    cy.visit('/balances/list');
  });

  function acessarBalanceDetail(): void {
    cy.get('table').should('exist');
    cy.get('p-button[icon="pi pi-search"]').first().should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/balances/detail');
  }

  it('deve acessar a página de detalhes ao clicar na lupa', () => {
    acessarBalanceDetail();
  });

  it('deve voltar para a lista ao clicar no ícone de lista', () => {
    acessarBalanceDetail();
    cy.get('p-button[icon="pi pi-list"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/balances/list');
  });

  it('deve ir para a página de edição ao clicar no ícone de lápis', () => {
    acessarBalanceDetail();
    cy.get('p-button[icon="pi pi-pencil"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/balances/edit');
  });
});
