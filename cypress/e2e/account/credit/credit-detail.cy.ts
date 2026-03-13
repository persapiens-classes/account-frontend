describe('Credit Account Detail Page', () => {
  beforeEach(() => {
    cy.session('login', () => {
      cy.maybeSetupAuthMock();
      cy.login();
    });

    cy.maybeSetupAccountsMock();

    cy.visitMain();
    cy.navigateToAccountList('credit');
  });

  function accessCreditAccountDetail(): void {
    // Wait for the table to exist
    cy.get('[data-cy="accounts-table"]').should('exist');
    // Check if there are any rows
    cy.get('[data-cy="accounts-table"]').find('tr').should('have.length.greaterThan', 0);
    // Click the first detail button
    cy.get('[data-cy="detail-button"]').first().should('be.visible').click();
    cy.url().should('include', '/creditAccounts/detail');
  }

  it('should access detail page by clicking magnifying glass icon', () => {
    accessCreditAccountDetail();
  });

  it('should go back to list by clicking list icon', () => {
    accessCreditAccountDetail();
    cy.get('[data-cy="list-button"]').should('be.visible').click();
    cy.url().should('include', '/creditAccounts/list');
  });

  it('should go to edit page by clicking pencil icon', () => {
    accessCreditAccountDetail();
    cy.get('[data-cy="edit-button"]').should('be.visible').click();
    cy.url().should('include', '/creditAccounts/edit');
  });
});
