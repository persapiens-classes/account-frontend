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
  });

  it('should create a new Credit Account for removal test', () => {
    cy.visit('/creditAccounts/new');
    cy.url().should('include', '/creditAccounts/new');

    cy.get('[data-cy="input-description"]').type(validCreditAccountDescription);

    cy.get('[data-cy="select-category"]').click();
    cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
    cy.get('[role="option"]').last().click();

    cy.get('[data-cy="save-button"]').should('not.be.disabled').click();
    cy.get('[data-cy="app-toast"]').should('be.visible');
    cy.url({ timeout: 10000 }).should('include', '/creditAccounts/detail');
  });

  it('should remove the newly created Credit Account successfully', () => {
    cy.visit('/creditAccounts/list');
    cy.get('[data-cy="filter-description"]', { timeout: 10000 }).should('exist');
    cy.wait(500);

    cy.get('[data-cy="filter-description"]', { timeout: 10000 })
      .should('be.visible')
      .clear({ force: true })
      .type(`${createdCreditAccountDescription}{enter}`);

    cy.contains('td', createdCreditAccountDescription, { timeout: 10000 }).should('be.visible');

    cy.contains('tr', createdCreditAccountDescription).within(() => {
      cy.get('[data-cy="delete-button"]').should('be.visible').click({ force: true });
    });

    // Wait for confirmation dialog
    cy.get('[data-cy="remove-confirm-dialog"]', { timeout: 10000 }).should('be.visible');

    // Click YES button (danger button)
    cy.get('.p-dialog .p-button-danger', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true });

    // Confirm that the success message appears
    cy.get('[data-cy="app-toast"]', { timeout: 10000 }).should('be.visible');

    // Confirm removal
    cy.contains('td', createdCreditAccountDescription, { timeout: 10000 }).should('not.exist');
  });
});
