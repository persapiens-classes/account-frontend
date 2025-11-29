describe('Debit Account Insert Page', () => {
  const validDebitAccountName = `debit_${Date.now()}`;

  beforeEach(() => {
    cy.session('login', () => {
      cy.visit('/login');
      cy.get('[data-cy="login-username"]').type('persapiens');
      cy.get('[data-cy="login-password"]').type('account');
      cy.get('[data-cy="login-button"]').click();
      cy.url({ timeout: 10000 }).should('include', '/balances/list');
    });

    cy.visit('/balances/list');

    // Navega pelo menu até Debit Accounts
    cy.get('p-menubar').contains('Account', { timeout: 10000 }).should('be.visible').click();
    cy.contains('Debit Account', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/debitAccounts/list');

    // Abre a página de criação
    cy.get('p-button[icon="pi pi-plus"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/debitAccounts/new');
  });

  it('permitir voltar para a lista', () => {
    cy.get('app-input-field input', { timeout: 10000 }).should('be.visible');
    cy.get('p-button[icon="pi pi-list"]').should('be.visible').click();
    cy.url().should('include', '/debitAccounts/list');
  });

  it('deve criar uma nova Debit Account com sucesso', () => {
    cy.get('app-input-field input').type(validDebitAccountName);

    cy.get('app-select-field[formControlName="selectCategory"] p-select').click();
    cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
    cy.get('[role="option"]').last().click();

    cy.get('p-button[icon="pi pi-check"]').should('not.be.disabled').click();
    cy.contains('Debit Account inserted', { timeout: 10000 }).should('exist');
    cy.url({ timeout: 10000 }).should('include', '/debitAccounts/detail');
  });
});
