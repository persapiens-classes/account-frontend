describe('Credit Account Detail Page', () => {
  beforeEach(() => {
    cy.session('login', () => {
      cy.visit('/login');
      cy.get('[data-cy="login-username"]').type('persapiens');
      cy.get('[data-cy="login-password"]').type('account');
      cy.get('[data-cy="login-button"]').click();
      cy.url({ timeout: 10000 }).should('include', '/balances/list');
    });

    cy.visit('/balances/list');

    // Navega pelo menu até Credit Account
    cy.get('p-menubar').contains('Account', { timeout: 10000 }).should('be.visible').click();
    cy.contains('Credit Account', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/creditAccounts/list');
  });

  function acessarCreditAccountDetail(): void {
    cy.get('table').should('exist');
    cy.get('p-button[icon="pi pi-search"]').first().should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/creditAccounts/detail');
  }

  it('deve acessar a página de detalhes ao clicar na lupa', () => {
    acessarCreditAccountDetail();
  });

  it('deve voltar para a lista ao clicar no ícone de lista', () => {
    acessarCreditAccountDetail();
    cy.get('p-button[icon="pi pi-list"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/creditAccounts/list');
  });

  it('deve ir para a página de edição ao clicar no ícone de lápis', () => {
    acessarCreditAccountDetail();
    cy.get('p-button[icon="pi pi-pencil"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/creditAccounts/edit');
  });
});
