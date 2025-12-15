describe('Balance Insert Page', () => {
  beforeEach(() => {
    cy.session('login', () => {
      cy.login();
    });

    cy.visit('/balances/list');
    cy.get('[data-cy="create-button"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/balances/new');
  });

  it('permitir voltar para a lista', () => {
    cy.get('[data-cy="list-button"]').should('be.visible').click();
    cy.url().should('include', '/balances/list');
  });

  it('deve criar um novo Balance com sucesso', () => {
    // Seleciona Owner - última opção
    cy.get('p-select[data-cy="select-owner"]').click();
    cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
    cy.get('[role="option"]').last().click();

    // Seleciona Equity Account - última opção
    cy.get('p-select[data-cy="select-equity-account"]').click();
    cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
    cy.get('[role="option"]').last().click();

    // Preenche o valor
    cy.get('[data-cy="input-initial-value"]').find('input').clear().type('10');

    // Submete
    cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

    // Valida que a inserção ocorreu
    cy.contains('Balances inserted', { timeout: 10000 }).should('exist');
    cy.url({ timeout: 10000 }).should('include', '/balances/detail');
  });
});
