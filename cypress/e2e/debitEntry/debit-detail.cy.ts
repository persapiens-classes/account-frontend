describe('Debit Entry Detail Page', () => {
  beforeEach(() => {
    cy.session('login', () => {
      cy.visit('/login');
      cy.get('[data-cy="login-username"]').type('persapiens');
      cy.get('[data-cy="login-password"]').type('account');
      cy.get('[data-cy="login-button"]').click();
      cy.url({ timeout: 10000 }).should('include', '/balances/list');
    });
    cy.visit('/balances/list');

    // Navega pelo menu até Debit Entry
    cy.contains('Debit Entry', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/debitEntries/list');
  });

  // Função para acessar o detalhe do primeiro item da lista
  function acessarDebitEntryDetail(): void {
    cy.get('table').should('exist');
    cy.get('p-button[icon="pi pi-search"]').first().should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/debitEntries/detail');
  }

  it('deve acessar a página de detalhes ao clicar na lupa', () => {
    acessarDebitEntryDetail();
  });

  it('deve voltar para a lista ao clicar no ícone de lista', () => {
    acessarDebitEntryDetail();
    cy.get('p-button[icon="pi pi-list"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/debitEntries/list');
  });

  it('deve ir para a página de edição ao clicar no ícone de lápis', () => {
    acessarDebitEntryDetail();
    cy.get('p-button[icon="pi pi-pencil"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/debitEntries/edit');
  });
});
