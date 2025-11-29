describe('Credit Remove Page', () => {
  const validCreditAccountName = `credit_${Date.now()}`; // nome único
  let createdCreditAccountName = validCreditAccountName;

  beforeEach(() => {
    cy.session('login', () => {
      cy.visit('/login');
      cy.get('[data-cy="login-username"]').type('persapiens');
      cy.get('[data-cy="login-password"]').type('account');
      cy.get('[data-cy="login-button"]').click();
      cy.url({ timeout: 10000 }).should('include', '/balances/list');
    });
  });

  it('deve criar um novo Credit Account para teste de remoção', () => {
    cy.visit('/creditAccounts/new');
    cy.url().should('include', '/creditAccounts/new');

    cy.get('app-input-field input').type(validCreditAccountName);

    cy.get('app-select-field[formControlName="selectCategory"] p-select').click();
    cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
    cy.get('[role="option"]').last().click();

    cy.get('p-button[icon="pi pi-check"]').should('not.be.disabled').click();
    cy.contains('Credit Account inserted', { timeout: 10000 }).should('exist');
    cy.url({ timeout: 10000 }).should('include', '/creditAccounts/detail');
  });

  it('deve remover o Credit Account recém-criado com sucesso', () => {
    cy.visit('/creditAccounts/list');

    cy.get('input[aria-label="Filter Description"]')
      .should('exist')
      .clear()
      .type(`${createdCreditAccountName}{enter}`);

    cy.contains('td', createdCreditAccountName, { timeout: 10000 }).should('be.visible');

    cy.contains('tr', createdCreditAccountName).find('.pi.pi-trash').click({ force: true });

    // Aguarda o dialog de confirmação
    cy.get('.p-dialog-mask', { timeout: 10000 }).should('be.visible');

    // Clica no botão YES (danger button)
    cy.get('.p-dialog-mask button.p-button-danger').should('be.visible').click({ force: true });

    // Confirma que foi removido
    cy.contains('td', createdCreditAccountName, { timeout: 10000 }).should('not.exist');
  });
});
