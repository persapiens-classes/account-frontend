describe('Debit Remove Page', () => {
  const validDebitAccountName = `debit_${Date.now()}`; // nome único
  let createdDebitAccountName = validDebitAccountName;

  beforeEach(() => {
    cy.session('login', () => {
      cy.visit('/login');
      cy.get('[data-cy="login-username"]').type('persapiens');
      cy.get('[data-cy="login-password"]').type('account');
      cy.get('[data-cy="login-button"]').click();
      cy.url({ timeout: 10000 }).should('include', '/balances/list');
    });
  });

  it('deve criar um novo Debit Account para teste de remoção', () => {
    cy.visit('/debitAccounts/new');
    cy.url().should('include', '/debitAccounts/new');

    cy.get('[data-cy="input-description"]').type(validDebitAccountName);

    cy.get('[data-cy="select-category"]').click();
    cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
    cy.get('[role="option"]').last().click();

    cy.get('p-button[icon="pi pi-check"]').should('not.be.disabled').click();
    cy.contains('Debit Account inserted', { timeout: 10000 }).should('exist');
    cy.url({ timeout: 10000 }).should('include', '/debitAccounts/detail');
  });

  it('deve remover o Debit Account recém-criado com sucesso', () => {
    cy.visit('/debitAccounts/list');

    cy.get('input[aria-label="Filter Description"]')
      .should('exist')
      .clear()
      .type(`${createdDebitAccountName}{enter}`);

    cy.contains('td', createdDebitAccountName, { timeout: 10000 }).should('be.visible');

    cy.contains('tr', createdDebitAccountName).find('.pi.pi-trash').click({ force: true });

    // Aguarda o dialog de confirmação
    cy.get('.p-dialog-mask', { timeout: 10000 }).should('be.visible');

    // Clica no botão YES (danger button)
    cy.get('.p-dialog-mask button.p-button-danger').should('be.visible').click({ force: true });

    // Confirma que foi removido
    cy.contains('td', createdDebitAccountName, { timeout: 10000 }).should('not.exist');
  });
});
