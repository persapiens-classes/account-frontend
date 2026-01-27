describe('Debit Account Detail Page', () => {
  beforeEach(() => {
    cy.session('login', () => {
      cy.maybeSetupAuthMock();
      cy.login();
    });

    cy.maybeSetupAccountsMock();
    cy.visit('/balances/list');

    // Navigate to debit account list
    cy.get('p-menubar').contains('Account', { timeout: 10000 }).click({ force: true });
    cy.get('p-menubar').contains('Debit Account', { timeout: 10000 }).click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/debitAccounts/list');
  });

  function accessDebitAccountDetail(): void {
    cy.get('[data-cy="accounts-table"]').should('exist');
    cy.get('[data-cy="accounts-table"] tbody tr').first().should('be.visible');
    cy.get('[data-cy="accounts-table"] tbody tr')
      .first()
      .within(() => {
        cy.get('[data-cy="detail-button"]').should('be.visible').click();
      });
    cy.url({ timeout: 10000 }).should('include', '/debitAccounts/detail');
  }

  it('should access detail page by clicking magnifying glass icon', () => {
    accessDebitAccountDetail();
  });

  it('should go back to list by clicking list icon', () => {
    accessDebitAccountDetail();
    cy.get('[data-cy="list-button"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/debitAccounts/list');
  });

  it('should go to edit page by clicking pencil icon', () => {
    accessDebitAccountDetail();
    cy.get('[data-cy="edit-button"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/debitAccounts/edit');
  });
});
