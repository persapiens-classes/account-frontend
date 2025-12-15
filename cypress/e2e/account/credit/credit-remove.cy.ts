describe('Credit Remove Page', () => {
  const validCreditAccountName = `credit_${Date.now()}`; // nome único
  const createdCreditAccountName = validCreditAccountName;

  beforeEach(() => {
    cy.session('login', () => {
      cy.login();
    });
  });

  it('deve criar um novo Credit Account para teste de remoção', () => {
    cy.visit('/creditAccounts/new');
    cy.url().should('include', '/creditAccounts/new');

    cy.get('[data-cy="input-description"]').type(validCreditAccountName);

    cy.get('[data-cy="select-category"]').click();
    cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
    cy.get('[role="option"]').last().click();

    cy.get('[data-cy="save-button"]').should('not.be.disabled').click();
    cy.get('[data-cy="app-toast"]').should('be.visible');
    cy.url({ timeout: 10000 }).should('include', '/creditAccounts/detail');
  });

  it('deve remover o Credit Account recém-criado com sucesso', () => {
    cy.visit('/creditAccounts/list');

    cy.get('input[aria-label="Filter Description"]')
      .should('exist')
      .clear()
      .type(`${createdCreditAccountName}{enter}`);

    cy.contains('td', createdCreditAccountName, { timeout: 10000 }).should('be.visible');

    cy.contains('tr', createdCreditAccountName).find('[data-cy="delete-button"]').click({ force: true });

    // Aguarda o dialog de confirmação
    cy.get('.p-dialog-mask', { timeout: 10000 }).should('be.visible');

    // Clica no botão YES (danger button)
    cy.get('.p-dialog-mask button.p-button-danger').should('be.visible').click({ force: true });

    // Confirma que foi removido
    cy.contains('td', createdCreditAccountName, { timeout: 10000 }).should('not.exist');
  });
});
