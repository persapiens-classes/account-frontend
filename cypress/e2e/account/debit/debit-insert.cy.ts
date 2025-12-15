describe('Debit Account Insert Page', () => {
  const validDebitAccountName = `debit_${Date.now()}`;

  beforeEach(() => {
    cy.session('login', () => {
      cy.login();
    });

    cy.visit('/balances/list');

    // Navega pelo menu até Debit Accounts
    cy.get('p-menubar').contains('Account', { timeout: 10000 }).should('be.visible').click();
    cy.contains('Debit Account', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/debitAccounts/list');

    // Abre a página de criação
    cy.get('[data-cy="create-button"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/debitAccounts/new');
  });

  it('permitir voltar para a lista', () => {
    cy.get('[data-cy="input-description"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-cy="list-button"]').should('be.visible').click();
    cy.url().should('include', '/debitAccounts/list');
  });

  it('deve criar uma nova Debit Account com sucesso', () => {
    cy.get('[data-cy="input-description"]').type(validDebitAccountName);

    cy.get('[data-cy="select-category"]').click();
    cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
    cy.get('[role="option"]').last().click();

    cy.get('[data-cy="save-button"]').should('not.be.disabled').click();
    cy.get('[data-cy="app-toast"]').should('be.visible');
    cy.url({ timeout: 10000 }).should('include', '/debitAccounts/detail');
  });
});
