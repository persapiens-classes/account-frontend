describe('Credit Account Detail Page', () => {
  beforeEach(() => {
    cy.session('login', () => {
      cy.maybeSetupAuthMock();
      cy.login();
    });

    cy.maybeSetupAccountsMock();
    cy.visit('/balances/list');

    // Navigate to credit account list
    cy.get('p-menubar').contains('Account', { timeout: 10000 }).click({ force: true });
    cy.get('p-menubar').contains('Credit Account', { timeout: 10000 }).click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/creditAccounts/list');
  });

  function accessCreditAccountDetail(): void {
    // Wait for the table to exist
    cy.get('[data-cy="accounts-table"]', { timeout: 10000 }).should('exist');
    // Check if there are any rows
    cy.get('[data-cy="accounts-table"]').find('tr').should('have.length.greaterThan', 0);
    // Click the first detail button
    cy.get('[data-cy="detail-button"]').first().should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/creditAccounts/detail');
  }

  it('should access detail page by clicking magnifying glass icon', () => {
    accessCreditAccountDetail();
  });

  it('should go back to list by clicking list icon', () => {
    accessCreditAccountDetail();
    cy.get('[data-cy="list-button"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/creditAccounts/list');
  });

  it('should go to edit page by clicking pencil icon', () => {
    accessCreditAccountDetail();
    cy.get('[data-cy="edit-button"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/creditAccounts/edit');
  });
});
