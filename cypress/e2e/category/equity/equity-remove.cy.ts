describe('Equity Remove Page', () => {
  const validEquityCategoryName = `equity_${Date.now()}`; // nome único
  let createdEquityCategoryName = validEquityCategoryName;

  beforeEach(() => {
    cy.session('login', () => {
      cy.visit('/login');
      cy.get('[data-cy="login-username"]').type('persapiens');
      cy.get('[data-cy="login-password"]').type('account');
      cy.get('[data-cy="login-button"]').click();
      cy.url({ timeout: 10000 }).should('include', '/balances/list');
    });
  });

  it('deve criar um novo Equity Category para teste de remoção', () => {
    cy.visit('/equityCategories/new');
    cy.url().should('include', '/equityCategories/new');

    cy.get('[data-cy="input-description"]').type(validEquityCategoryName);
    cy.get('p-button[icon="pi pi-check"]').should('not.be.disabled').click();
    cy.contains('Equity Category inserted', { timeout: 10000 }).should('exist');
    cy.url({ timeout: 10000 }).should('include', '/equityCategories/detail');
  });

  it('deve remover o Equity Category recém-criado com sucesso', () => {
    cy.visit('/equityCategories/list');

    cy.get('input[aria-label="Filter Description"]')
      .should('exist')
      .clear()
      .type(`${createdEquityCategoryName}{enter}`);

    cy.contains('td', createdEquityCategoryName, { timeout: 10000 }).should('be.visible');

    cy.contains('tr', createdEquityCategoryName).find('.pi.pi-trash').click({ force: true });

    // Aguarda o dialog de confirmação
    cy.get('.p-dialog-mask', { timeout: 10000 }).should('be.visible');

    // Clica no botão YES (danger button)
    cy.get('.p-dialog-mask button.p-button-danger').should('be.visible').click({ force: true });

    // Confirma que foi removido
    cy.contains('td', createdEquityCategoryName, { timeout: 10000 }).should('not.exist');
  });
});
