describe('Credit Entry Insert Page', () => {
  beforeEach(() => {
    cy.session('login', () => {
      cy.visit('/login');
      cy.get('[data-cy="login-username"]').type('persapiens');
      cy.get('[data-cy="login-password"]').type('account');
      cy.get('[data-cy="login-button"]').click();
      cy.url({ timeout: 10000 }).should('include', '/balances/list');
    });

    cy.visit('/balances/list');
    cy.contains('Credit Entry', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/creditEntries/list');
    cy.get('p-button[icon="pi pi-plus"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/creditEntries/new');
  });

  it('permitir voltar para a lista', () => {
    cy.get('p-button[icon="pi pi-list"]').should('be.visible').click();
    cy.url().should('include', '/creditEntries/list');
  });

  it('deve criar uma nova Credit Entry com sucesso', () => {
    // Preenche a data (usar data de hoje)
    cy.get('[data-cy="input-date"]').click();
    cy.get('.p-datepicker-today').click();

    // Seleciona In Owner
    cy.get('[data-cy="select-in-owner"]').click();
    cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
    cy.get('[role="option"]').last().click();

    // Seleciona In Account
    cy.get('[data-cy="select-in-account"]').click();
    cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
    cy.get('[role="option"]').last().click();

    // Seleciona Out Owner
    cy.get('[data-cy="select-out-owner"]').click();
    cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
    cy.get('[role="option"]').last().click();

    // Seleciona Out Account
    cy.get('[data-cy="select-out-account"]').click();
    cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
    cy.get('[role="option"]').last().click();

    // Preenche o valor
    cy.get('[data-cy="input-value"]').find('input').clear().type('10');

    // Preenche a nota
    cy.get('[data-cy="input-note"]').type('teste nota');

    // Submete
    cy.get('p-button[icon="pi pi-check"]').should('not.be.disabled').click();

    // Valida que a inserção ocorreu
    cy.contains('Credit Entry inserted', { timeout: 10000 }).should('exist');
    cy.url({ timeout: 10000 }).should('include', '/creditEntries/detail');
  });
});
