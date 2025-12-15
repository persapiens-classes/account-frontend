describe('Debit Entry Detail Page', () => {
  beforeEach(() => {
    cy.session('login', () => {
      cy.login();
    });
    cy.visit('/balances/list');

    // Navega pelo menu até Debit Entry
    cy.contains('Debit Entry', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/debitEntries/list');
  });

  // Função para acessar o detalhe do primeiro item da lista
  function acessarDebitEntryDetail(): void {
    cy.get('table').should('exist');
    cy.get('[data-cy="detail-button"]').first().should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/debitEntries/detail');
  }

  it('deve acessar a página de detalhes ao clicar na lupa', () => {
    acessarDebitEntryDetail();
  });

  it('deve voltar para a lista ao clicar no ícone de lista', () => {
    acessarDebitEntryDetail();
    cy.get('[data-cy="list-button"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/debitEntries/list');
  });

  it('deve ir para a página de edição ao clicar no ícone de lápis', () => {
    acessarDebitEntryDetail();
    cy.get('[data-cy="edit-button"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/debitEntries/edit');
  });
});
