describe('Debit Account Detail Page', () => {
  beforeEach(() => {
    cy.session('login', () => {
      cy.login();
    });

    cy.visit('/balances/list');

    // Navega pelo menu até Debit Account
    cy.get('p-menubar').contains('Account', { timeout: 10000 }).should('be.visible').click();
    cy.contains('Debit Account', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/debitAccounts/list');
  });

  function acessarDebitAccountDetail(): void {
    cy.get('table').should('exist');
    cy.get('p-button[icon="pi pi-search"]').first().should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/debitAccounts/detail');
  }

  it('deve acessar a página de detalhes ao clicar na lupa', () => {
    acessarDebitAccountDetail();
  });

  it('deve voltar para a lista ao clicar no ícone de lista', () => {
    acessarDebitAccountDetail();
    cy.get('p-button[icon="pi pi-list"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/debitAccounts/list');
  });

  it('deve ir para a página de edição ao clicar no ícone de lápis', () => {
    acessarDebitAccountDetail();
    cy.get('p-button[icon="pi pi-pencil"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/debitAccounts/edit');
  });
});
