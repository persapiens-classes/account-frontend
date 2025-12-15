describe('Debit Entry Insert Page', () => {
  beforeEach(() => {
    cy.session('login', () => {
      cy.login();
    });

    cy.visit('/balances/list');
    cy.contains('Debit Entry', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/debitEntries/list');
    cy.get('[data-cy="create-button"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/debitEntries/new');
  });

  it('permitir voltar para a lista', () => {
    cy.get('[data-cy="list-button"]').should('be.visible').click();
    cy.url().should('include', '/debitEntries/list');
  });

  it('deve criar uma nova Debit Entry com sucesso', () => {
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
    cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

    // Valida que a inserção ocorreu
    cy.get('[data-cy="app-toast"]').should('be.visible');
    cy.url({ timeout: 10000 }).should('include', '/debitEntries/detail');
  });
});
