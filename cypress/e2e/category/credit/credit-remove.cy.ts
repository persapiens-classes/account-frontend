describe('Credit Remove Page', () => {
  const validCreditCategoryName = `credit_${Date.now()}`; // nome único
  let createdCreditCategoryName = validCreditCategoryName;

  beforeEach(() => {
    cy.session('login', () => {
      cy.visit('/login');
      cy.get('[data-cy="login-username"]').type('persapiens');
      cy.get('[data-cy="login-password"]').type('account');
      cy.get('[data-cy="login-button"]').click();
      cy.url({ timeout: 10000 }).should('include', '/balances/list');
    });
  });

  it('deve criar um novo Credit Category para teste de remoção', () => {
    cy.visit('/creditCategories/new');
    cy.url().should('include', '/creditCategories/new');

    cy.get('[data-cy="input-description"]').type(validCreditCategoryName);
    cy.get('p-button[icon="pi pi-check"]').should('not.be.disabled').click();
    cy.contains('Credit Category inserted', { timeout: 10000 }).should('exist');
    cy.url({ timeout: 10000 }).should('include', '/creditCategories/detail');
  });

  it('deve remover o Credit Category recém-criado com sucesso', () => {
    cy.visit('/creditCategories/list');

    cy.get('input[aria-label="Filter Description"]')
      .should('exist')
      .clear()
      .type(`${createdCreditCategoryName}{enter}`);

    cy.contains('td', createdCreditCategoryName, { timeout: 10000 }).should('be.visible');

    cy.contains('tr', createdCreditCategoryName).find('.pi.pi-trash').click({ force: true });

    // Aguarda o dialog de confirmação
    cy.get('.p-dialog-mask', { timeout: 10000 }).should('be.visible');

    // Clica no botão YES (danger button)
    cy.get('.p-dialog-mask button.p-button-danger').should('be.visible').click({ force: true });

    // Confirma que foi removido
    cy.contains('td', createdCreditCategoryName, { timeout: 10000 }).should('not.exist');
  });
});
