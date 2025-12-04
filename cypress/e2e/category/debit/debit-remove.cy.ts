describe('Debit Remove Page', () => {
  const validDebitCategoryName = `debit_${Date.now()}`; // nome único
  const createdDebitCategoryName = validDebitCategoryName;

  beforeEach(() => {
    cy.session('login', () => {
      cy.login();
    });
  });

  it('deve criar um novo Debit Category para teste de remoção', () => {
    cy.visit('/debitCategories/new');
    cy.url().should('include', '/debitCategories/new');

    cy.get('[data-cy="input-description"]').type(validDebitCategoryName);
    cy.get('p-button[icon="pi pi-check"]').should('not.be.disabled').click();
    cy.get('[data-cy="app-toast"]').should('be.visible');
    cy.url({ timeout: 10000 }).should('include', '/debitCategories/detail');
  });

  it('deve remover o Debit Category recém-criado com sucesso', () => {
    cy.visit('/debitCategories/list');

    cy.get('input[aria-label="Filter Description"]')
      .should('exist')
      .clear()
      .type(`${createdDebitCategoryName}{enter}`);

    cy.contains('td', createdDebitCategoryName, { timeout: 10000 }).should('be.visible');

    cy.contains('tr', createdDebitCategoryName).find('.pi.pi-trash').click({ force: true });

    // Aguarda o dialog de confirmação
    cy.get('.p-dialog-mask', { timeout: 10000 }).should('be.visible');

    // Clica no botão YES (danger button)
    cy.get('.p-dialog-mask button.p-button-danger').should('be.visible').click({ force: true });

    // Confirma que foi removido
    cy.contains('td', createdDebitCategoryName, { timeout: 10000 }).should('not.exist');
  });
});
