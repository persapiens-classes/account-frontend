describe('Equity Account Detail Page', () => {
  beforeEach(() => {
    cy.session('login', () => {
      cy.maybeSetupAuthMock();
      cy.login();
    });

    cy.maybeSetupAccountsMock();

    cy.visitMain();
    cy.navigateToAccountList('equity');
  });

  function accessEquityAccountDetail(): void {
    cy.get('[data-cy="accounts-table"]').should('exist');
    cy.get('[data-cy="accounts-table"] tbody tr').first().should('be.visible');
    cy.get('[data-cy="accounts-table"] tbody tr')
      .first()
      .within(() => {
        cy.get('[data-cy="detail-button"]').should('be.visible').click();
      });
    cy.url().should('include', '/equityAccounts/detail');
  }

  it('should access detail page by clicking magnifying glass icon', () => {
    accessEquityAccountDetail();
  });

  it('should go back to list by clicking list icon', () => {
    accessEquityAccountDetail();
    cy.get('[data-cy="list-button"]').should('be.visible').click();
    cy.url().should('include', '/equityAccounts/list');
  });

  it('should go to edit page by clicking pencil icon', () => {
    accessEquityAccountDetail();
    cy.get('[data-cy="edit-button"]').should('be.visible').click();
    cy.url().should('include', '/equityAccounts/edit');
  });
});
