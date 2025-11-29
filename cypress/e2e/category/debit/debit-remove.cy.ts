describe('Debit Remove Page', () => {
  const validDebitCategoryName = `debit_${Date.now()}`; // nome único
  let createdDebitCategoryName = validDebitCategoryName;

  beforeEach(() => {
    cy.session('login', () => {
      cy.visit('/login');
      cy.get('[data-cy="login-username"]').type('persapiens');
      cy.get('[data-cy="login-password"]').type('account');
      cy.get('[data-cy="login-button"]').click();
      cy.url({ timeout: 10000 }).should('include', '/balances/list');
    });
  });

  it('deve criar um novo Debit Category para teste de remoção', () => {
    cy.visit('/debitCategories/new');
    cy.url().should('include', '/debitCategories/new');

    cy.get('app-input-field input').type(validDebitCategoryName);
    cy.get('p-button[icon="pi pi-check"]').should('not.be.disabled').click();
    cy.contains('Debit Category inserted', { timeout: 10000 }).should('exist');
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
