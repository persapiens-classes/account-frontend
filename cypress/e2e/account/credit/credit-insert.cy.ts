describe('Credit Account Insert Page', () => {
  const validCreditAccountName = `credit_${Date.now()}`;

  beforeEach(() => {
    cy.session('login', () => {
      cy.login();
    });

    cy.visit('/balances/list');

    // Navega pelo menu até Credit Accounts
    cy.get('p-menubar').contains('Account', { timeout: 10000 }).should('be.visible').click();
    cy.contains('Credit Account', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/creditAccounts/list');

    // Abre a página de criação
    cy.get('[data-cy="create-button"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/creditAccounts/new');
  });

  it('permitir voltar para a lista', () => {
    cy.get('[data-cy="input-description"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-cy="list-button"]').should('be.visible').click();
    cy.url().should('include', '/creditAccounts/list');
  });

  it('deve criar uma nova Credit Account com sucesso', () => {
    cy.get('[data-cy="input-description"]').type(validCreditAccountName);

    cy.get('[data-cy="select-category"]').click();
    cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
    cy.get('[role="option"]').last().click();

    cy.get('[data-cy="save-button"]').should('not.be.disabled').click();
    cy.get('[data-cy="app-toast"]').should('be.visible');
    cy.url({ timeout: 10000 }).should('include', '/creditAccounts/detail');
  });
});
