describe('Owner Insert Page', () => {
  const validOwnerName = `fabiana_${Date.now()}`; // nome dinâmico para evitar duplicidade

  beforeEach(() => {
    cy.session('login', () => {
      cy.visit('/login');
      cy.get('[data-cy="login-username"]').type('persapiens');
      cy.get('[data-cy="login-password"]').type('account');
      cy.get('[data-cy="login-button"]').click();
      cy.url({ timeout: 10000 }).should('include', '/balances/list');
    });

    cy.visit('/balances/list');

    // Caminho para a página de criação de owner
    cy.contains('Owner', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/owners/list');
    cy.get('p-button[icon="pi pi-plus"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/owners/new');
  });

  it('permitir voltar para a lista', () => {
    cy.get('p-button[icon="pi pi-list"]').should('be.visible').click();
    cy.url().should('include', '/owners/list');
  });

  it('deve criar um novo Owner com sucesso', () => {
    cy.get('[data-cy="input-name"]').type(validOwnerName);
    cy.get('p-button[icon="pi pi-check"]').should('not.be.disabled').click();
    cy.contains('Owner inserted', { timeout: 10000 }).should('exist');
    cy.url({ timeout: 10000 }).should('include', '/owners/detail');
  });
});
