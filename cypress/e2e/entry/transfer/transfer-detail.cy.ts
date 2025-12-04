describe('Transfer Entry Detail Page', () => {
  // Mantém sessão de login antes de cada teste
  beforeEach(() => {
    cy.session('login', () => {
      cy.login();
    });
    cy.visit('/balances/list');

    // Navega pelo menu até Transfer Entry
    cy.contains('Transfer Entry', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/transferEntries/list');
  });

  // Função para acessar o detalhe do primeiro item da lista
  function acessarCreditTransferEntryDetail(): void {
    cy.get('table').should('exist');
    cy.get('p-button[icon="pi pi-search"]').first().should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/transferEntries/detail');
  }

  it('deve acessar a página de detalhes ao clicar na lupa', () => {
    acessarCreditTransferEntryDetail();
  });

  it('deve voltar para a lista ao clicar no ícone de lista', () => {
    acessarCreditTransferEntryDetail();
    cy.get('p-button[icon="pi pi-list"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/transferEntries/list');
  });

  it('deve ir para a página de edição ao clicar no ícone de lápis', () => {
    acessarCreditTransferEntryDetail();
    cy.get('p-button[icon="pi pi-pencil"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/transferEntries/edit');
  });
});
