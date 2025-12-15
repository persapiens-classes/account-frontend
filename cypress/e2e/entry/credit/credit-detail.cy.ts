describe('Credit Entry Detail Page', () => {
  beforeEach(() => {
    cy.session('login', () => {
      cy.login();
    });
    cy.visit('/balances/list');

    // Navega pelo menu até Credit Entry
    cy.contains('Credit Entry', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/creditEntries/list');
  });

  // Função para acessar o detalhe do primeiro item da lista
  function acessarCreditEntryDetail(): void {
    cy.get('table').should('exist');
    cy.get('[data-cy="detail-button"]').first().should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/creditEntries/detail');
  }

  it('deve acessar a página de detalhes ao clicar na lupa', () => {
    acessarCreditEntryDetail();
  });

  it('deve voltar para a lista ao clicar no ícone de lista', () => {
    acessarCreditEntryDetail();
    cy.get('[data-cy="list-button"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/creditEntries/list');
  });

  it('deve ir para a página de edição ao clicar no ícone de lápis', () => {
    acessarCreditEntryDetail();
    cy.get('[data-cy="edit-button"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/creditEntries/edit');
  });
});
