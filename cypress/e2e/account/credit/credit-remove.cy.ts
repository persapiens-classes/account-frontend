describe('Credit Account Remove Page', () => {
  const validCreditAccountDescription = `credit_${Date.now()}`; // dynamic description to avoid duplicates
  const createdCreditAccountDescription = validCreditAccountDescription;

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

  it('should create a new Credit Account for removal test', () => {
    cy.navigateToAccountNew('credit');

    cy.get('[data-cy="input-description"]').type(validCreditAccountDescription);

    cy.get('[data-cy="select-category"]').click();
    cy.get('[role="listbox"]').should('be.visible');
    cy.get('[role="option"]').last().click();

    cy.get('[data-cy="save-button"]').should('not.be.disabled').click();
    cy.get('[data-cy="app-toast"]').should('be.visible');
    cy.url().should('include', '/creditAccounts/detail');
  });

  it('should remove the newly created Credit Account successfully', () => {
    cy.navigateToAccountList('credit');
    cy.get('[data-cy="filter-description"]').should('exist');
    cy.wait(500);

    cy.get('[data-cy="filter-description"]')
      .should('be.visible')
      .clear({ force: true })
      .type(`${createdCreditAccountDescription}{enter}`);

    cy.contains('td', createdCreditAccountDescription).should('be.visible');

    cy.contains('tr', createdCreditAccountDescription).within(() => {
      cy.get('[data-cy="delete-button"]').should('be.visible').click({ force: true });
    });

    // Wait for confirmation dialog
    cy.get('[data-cy="remove-confirm-dialog"]').should('be.visible');

    // Click YES button (danger button)
    cy.get('.p-dialog .p-button-danger').should('be.visible').click({ force: true });

    // Confirm that the success message appears
    cy.get('[data-cy="app-toast"]').should('be.visible');

    // Confirm removal
    cy.contains('td', createdCreditAccountDescription).should('not.exist');
  });
});
