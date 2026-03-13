describe('Debit Account Remove Page', () => {
  const validDebitAccountDescription = `debit_${Date.now()}`; // dynamic description to avoid duplicates
  const createdDebitAccountDescription = validDebitAccountDescription;

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

  it('should create a new Debit Account for removal test', () => {
    cy.navigateToAccountNew('debit');
    cy.url().should('include', '/debitAccounts/new');

    cy.get('[data-cy="input-description"]').type(validDebitAccountDescription);

    cy.get('[data-cy="select-category"]').click();
    cy.get('[role="listbox"]').should('be.visible');
    cy.get('[role="option"]').last().click();

    cy.get('[data-cy="save-button"]').should('not.be.disabled').click();
    cy.get('[data-cy="app-toast"]').should('be.visible');
    cy.url().should('include', '/debitAccounts/detail');
  });

  it('should remove the newly created Debit Account successfully', () => {
    cy.navigateToAccountList('debit');
    cy.get('[data-cy="filter-description"]').should('exist');
    cy.wait(500);

    cy.get('[data-cy="filter-description"]')
      .should('be.visible')
      .clear({ force: true })
      .type(`${createdDebitAccountDescription}{enter}`);

    cy.contains('td', createdDebitAccountDescription).should('be.visible');

    cy.contains('tr', createdDebitAccountDescription).within(() => {
      cy.get('[data-cy="delete-button"]').should('be.visible').click({ force: true });
    });

    // Wait for confirmation dialog
    cy.get('[data-cy="remove-confirm-dialog"]').should('be.visible');

    // Click YES button (danger button)
    cy.get('.p-dialog .p-button-danger').should('be.visible').click({ force: true });

    // Confirm that the success message appears
    cy.get('[data-cy="app-toast"]').should('be.visible');

    // Confirm removal
    cy.contains('td', createdDebitAccountDescription).should('not.exist');
  });
});
