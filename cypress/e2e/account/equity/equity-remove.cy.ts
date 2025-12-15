describe('Equity Remove Page', () => {
  const validEquityAccountName = `equity_${Date.now()}`; // nome único
  const createdEquityAccountName = validEquityAccountName;

  beforeEach(() => {
    cy.session('login', () => {
      cy.login();
    });
  });

  it('deve criar um novo Equity Account para teste de remoção', () => {
    cy.visit('/equityAccounts/new');
    cy.url().should('include', '/equityAccounts/new');

    cy.get('[data-cy="input-description"]').type(validEquityAccountName);

    cy.get('[data-cy="select-category"]').click();
    cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
    cy.get('[role="option"]').last().click();

    cy.get('[data-cy="save-button"]').should('not.be.disabled').click();
    cy.get('[data-cy="app-toast"]').should('be.visible');
    cy.url({ timeout: 10000 }).should('include', '/equityAccounts/detail');
  });

  it('deve remover o Equity Account recém-criado com sucesso', () => {
    cy.visit('/equityAccounts/list');

    cy.get('input[aria-label="Filter Description"]')
      .should('exist')
      .clear()
      .type(`${createdEquityAccountName}{enter}`);

    cy.contains('td', createdEquityAccountName, { timeout: 10000 }).should('be.visible');

    cy.contains('tr', createdEquityAccountName).find('[data-cy="delete-button"]').click({ force: true });

    // Aguarda o dialog de confirmação
    cy.get('.p-dialog-mask', { timeout: 10000 }).should('be.visible');

    // Clica no botão YES (danger button)
    cy.get('.p-dialog-mask button.p-button-danger').should('be.visible').click({ force: true });

    // Confirma que foi removido
    cy.contains('td', createdEquityAccountName, { timeout: 10000 }).should('not.exist');
  });
});
