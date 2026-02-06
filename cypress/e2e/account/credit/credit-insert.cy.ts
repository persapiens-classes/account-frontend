describe('Credit Account Insert Page', () => {
  const validCreditAccountDescription = `credit_${Date.now()}`; // dynamic description to avoid duplicates

  beforeEach(() => {
    // Reset created accounts state for mock
    Cypress.env('createdAccounts', []);

    cy.session('login', () => {
      cy.maybeSetupAuthMock();
      cy.login();
    });

    cy.maybeSetupAccountsMock();
    cy.maybeSetupCategoriesMock();
    cy.visit('/balances/list');

    // Path to credit account creation page
    cy.get('p-menubar').contains('Account', { timeout: 10000 }).click({ force: true });
    cy.contains('Credit Account', { timeout: 10000 }).click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/creditAccounts/list');

    // Open creation page
    cy.get('[data-cy="create-button"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/creditAccounts/new');
  });

  it('should allow going back to the list', () => {
    cy.get('[data-cy="input-description"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-cy="list-button"]').should('be.visible').click();
    cy.url().should('include', '/creditAccounts/list');
  });

  it('should create a new Credit Account successfully', () => {
    cy.get('[data-cy="input-description"]').type(validCreditAccountDescription);

    cy.get('[data-cy="select-category"]').click();
    cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
    cy.get('[role="option"]').last().click();

    cy.get('[data-cy="save-button"]').should('not.be.disabled').click();
    cy.get('[data-cy="app-toast"]').should('be.visible');
    cy.url({ timeout: 10000 }).should('include', '/creditAccounts/detail');
  });

  describe('Validation Tests', () => {
    it('AC-01: should fail when trying to create credit account with only whitespaces', () => {
      cy.fixture('accounts').then((accountsData) => {
        const testCase = accountsData.boundaryValues['AC-01'];

        cy.get('[data-cy="input-description"]').type(testCase.description);

        cy.get('[data-cy="select-category"]').click();
        cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
        cy.get('[role="option"]').last().click();

        cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

        cy.url({ timeout: 5000 }).should('include', '/creditAccounts/new');
      });
    });

    it('AC-02: should create credit account successfully using 3 characters (lower limit)', () => {
      cy.fixture('accounts').then((accountsData) => {
        const testCase = accountsData.boundaryValues['AC-02'];
        const uniqueDescription = `${testCase.description}_${Date.now()}`;

        cy.get('[data-cy="input-description"]').type(uniqueDescription);

        cy.get('[data-cy="select-category"]').click();
        cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
        cy.get('[role="option"]').last().click();

        cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

        cy.get('[data-cy="app-toast"]', { timeout: 10000 }).should('be.visible');
        cy.url({ timeout: 10000 }).should('include', '/creditAccounts/detail');
      });
    });

    it('AC-03: should create credit account successfully using 255 characters (upper limit)', () => {
      cy.fixture('accounts').then((accountsData) => {
        const testCase = accountsData.boundaryValues['AC-03'];
        const uniqueDescription = testCase.description;

        cy.get('[data-cy="input-description"]').type(uniqueDescription);

        cy.get('[data-cy="select-category"]').click();
        cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
        cy.get('[role="option"]').last().click();

        cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

        cy.get('[data-cy="app-toast"]', { timeout: 10000 }).should('be.visible');
        cy.url({ timeout: 10000 }).should('include', '/creditAccounts/detail');
      });
    });

    it.skip('AC-04: should fail when trying to create credit account with 256 characters (exceeds upper limit)', () => {
      cy.fixture('accounts').then((accountsData) => {
        const testCase = accountsData.boundaryValues['AC-04'];

        cy.get('[data-cy="input-description"]').type(testCase.description);

        cy.get('[data-cy="select-category"]').click();
        cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
        cy.get('[role="option"]').last().click();

        cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

        cy.url({ timeout: 5000 }).should('include', '/creditAccounts/new');
      });
    });

    it('AC-05: should fail when trying to create credit account with empty category', () => {
      cy.fixture('accounts').then((accountsData) => {
        const testCase = accountsData.boundaryValues['AC-05'];

        cy.get('[data-cy="input-description"]').type(testCase.description);

        // Do not select a category to test empty category validation
        cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

        cy.url({ timeout: 5000 }).should('include', '/creditAccounts/new');
      });
    });

    it('AC-06: should create credit account successfully with valid category', () => {
      cy.get('[data-cy="input-description"]').type(`valid_account_${Date.now()}`);

      cy.get('[data-cy="select-category"]').click();
      cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
      cy.get('[role="option"]').last().click();

      cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

      cy.get('[data-cy="app-toast"]', { timeout: 10000 }).should('be.visible');
      cy.url({ timeout: 10000 }).should('include', '/creditAccounts/detail');
    });
  });
});
