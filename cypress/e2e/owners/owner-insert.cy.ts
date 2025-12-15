describe('Owner Insert Page', () => {
  const validOwnerName = `fabiana_${Date.now()}`; // nome dinâmico para evitar duplicidade

  beforeEach(() => {
    cy.session('login', () => {
      cy.login(); // comando customizado com variáveis de ambiente
    });

    cy.visit('/balances/list');

    // Caminho para a página de criação de owner
    cy.contains('Owner', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/owners/list');
    cy.get('[data-cy="create-button"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/owners/new');
  });

  it('permitir voltar para a lista', () => {
    cy.get('[data-cy="list-button"]').should('be.visible').click();
    cy.url().should('include', '/owners/list');
  });

  it('deve criar um novo Owner com sucesso', () => {
    cy.get('[data-cy="input-name"]').type(validOwnerName);
    cy.get('[data-cy="save-button"]').should('not.be.disabled').click();
    cy.get('[data-cy="app-toast"]').should('be.visible');
    cy.url({ timeout: 10000 }).should('include', '/owners/detail');
  });
});
