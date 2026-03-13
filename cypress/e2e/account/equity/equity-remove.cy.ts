describe('Equity Account Remove Page', () => {
  const validEquityAccountDescription = Cypress._.uniqueId('equity_'); // dynamic description to avoid duplicates
  const createdEquityAccountDescription = validEquityAccountDescription;

  beforeEach(() => {
    // Reset created accounts state for mock
    Cypress.env('createdAccounts', []);

    cy.session('login', () => {
      cy.maybeSetupAuthMock();
      cy.login();
    });

    cy.maybeSetupAccountsMock();
    cy.maybeSetupCategoriesMock();

    cy.visitMain();
  });

  it('should create a new Equity Account for removal test', () => {
    cy.navigateToAccountNew('equity');
    cy.url().should('include', '/equityAccounts/new');

    cy.get('[data-cy="input-description"]').type(validEquityAccountDescription);

    cy.get('[data-cy="select-category"]').click();
    cy.get('[role="listbox"]').should('be.visible');
    cy.get('[role="option"]').last().click();

    cy.get('[data-cy="save-button"]').should('not.be.disabled').click();
    cy.get('[data-cy="app-toast"]').should('be.visible');
    cy.url().should('include', '/equityAccounts/detail');
  });

  it('should remove the newly created Equity Account successfully', () => {
    cy.navigateToAccountList('equity');
    cy.get('[data-cy="filter-description"]').should('exist');
    cy.wait(500);

    cy.get('[data-cy="filter-description"]')
      .should('be.visible')
      .clear({ force: true })
      .type(`${createdEquityAccountDescription}{enter}`);

    cy.contains('td', createdEquityAccountDescription).should('be.visible');

    cy.contains('tr', createdEquityAccountDescription).within(() => {
      cy.get('[data-cy="delete-button"]').should('be.visible').click({ force: true });
    });

    // Wait for confirmation dialog
    cy.get('[data-cy="remove-confirm-dialog"]').should('be.visible');

    // Click YES button (danger button)
    cy.get('.p-dialog .p-button-danger').should('be.visible').click({ force: true });

    // Confirm that the success message appears
    cy.get('[data-cy="app-toast"]').should('be.visible');

    // Confirm removal
    cy.contains('td', createdEquityAccountDescription).should('not.exist');
  });
});
