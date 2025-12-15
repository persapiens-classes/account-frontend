describe('Debit Remove Page', () => {
  const validDebitAccountName = `debit_${Date.now()}`; // nome único
  const createdDebitAccountName = validDebitAccountName;

  beforeEach(() => {
    cy.session('login', () => {
      cy.login();
    });
  });

  it('deve criar um novo Debit Account para teste de remoção', () => {
    cy.visit('/debitAccounts/new');
    cy.url().should('include', '/debitAccounts/new');

    cy.get('[data-cy="input-description"]').type(validDebitAccountName);

    cy.get('[data-cy="select-category"]').click();
    cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
    cy.get('[role="option"]').last().click();

    cy.get('[data-cy="save-button"]').should('not.be.disabled').click();
    cy.get('[data-cy="app-toast"]').should('be.visible');
    cy.url({ timeout: 10000 }).should('include', '/debitAccounts/detail');
  });

  it('deve remover o Debit Account recém-criado com sucesso', () => {
    cy.visit('/debitAccounts/list');

    cy.get('input[aria-label="Filter Description"]')
      .should('exist')
      .clear()
      .type(`${createdDebitAccountName}{enter}`);

    cy.contains('td', createdDebitAccountName, { timeout: 10000 }).should('be.visible');

    cy.contains('tr', createdDebitAccountName).find('[data-cy="delete-button"]').click({ force: true });

    // Aguarda o dialog de confirmação
    cy.get('.p-dialog-mask', { timeout: 10000 }).should('be.visible');

    // Clica no botão YES (danger button)
    cy.get('.p-dialog-mask button.p-button-danger').should('be.visible').click({ force: true });

    // Confirma que foi removido
    cy.contains('td', createdDebitAccountName, { timeout: 10000 }).should('not.exist');
  });
});
