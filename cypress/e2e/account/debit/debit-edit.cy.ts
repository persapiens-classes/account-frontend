describe('Debit Account Edit Page', () => {
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

    cy.get('p-menubar').contains('Account', { timeout: 10000 }).click({ force: true });
    cy.contains('Debit Account', { timeout: 10000 }).click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/debitAccounts/list');
  });

  function captureLastDebitAccount(): void {
    cy.get('[data-cy="accounts-table"] tbody tr', { timeout: 10000 })
      .last()
      .find('td')
      .first()
      .invoke('text')
      .then((text) => text.trim())
      .as('lastDebitAccountDescription');
  }

  it('clicking pencil on last debit account opens edit', () => {
    cy.get('[data-cy="accounts-table"] tbody tr', { timeout: 10000 })
      .last()
      .within(() => {
        cy.get('[data-cy="edit-button"]').should('be.visible').click();
      });

    cy.url({ timeout: 10000 }).should('include', '/debitAccounts/edit');
  });

  it('go back to list using list icon', () => {
    cy.get('[data-cy="accounts-table"] tbody tr', { timeout: 10000 })
      .last()
      .within(() => {
        cy.get('[data-cy="edit-button"]').should('be.visible').click();
      });

    cy.url({ timeout: 10000 }).should('include', '/debitAccounts/edit');

    cy.get('[data-cy="list-button"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/debitAccounts/list');
  });

  it('navigation: clicking magnifying glass on last debit account goes to details', () => {
    cy.get('[data-cy="accounts-table"] tbody tr', { timeout: 10000 })
      .last()
      .within(() => {
        cy.get('[data-cy="detail-button"]').should('be.visible').click();
      });

    cy.url({ timeout: 10000 }).should('include', '/debitAccounts/detail');
  });

  it('edit last debit account by adding _edited to the description', () => {
    captureLastDebitAccount();

    cy.get('@lastDebitAccountDescription').then((originalDescription) => {
      cy.get('[data-cy="accounts-table"] tbody tr', { timeout: 10000 })
        .last()
        .within(() => {
          cy.get('[data-cy="edit-button"]').should('be.visible').click();
        });

      cy.url({ timeout: 10000 }).should('include', '/debitAccounts/edit');

      const newDescription = `${originalDescription}_edited`;

      cy.get('[data-cy="input-description"]', { timeout: 10000 })
        .should('be.visible')
        .clear()
        .type(newDescription);

        cy.get('[data-cy="save-button"]').should('not.be.disabled').click({ force: true });
    });
  });

  describe('Validation Tests', () => {
    const validDebitAccountDescription = `debit_${Date.now()}`;

    beforeEach(() => {
      // Create a debit account first that will be edited in tests
      cy.maybeSetupCategoriesMock();
      cy.visit('/debitAccounts/new');
      cy.get('[data-cy="input-description"]').type(validDebitAccountDescription);

      cy.get('[data-cy="select-category"]').click();
      cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
      cy.get('[role="option"]').last().click();

      cy.get('[data-cy="save-button"]').should('not.be.disabled').click();
      cy.get('[data-cy="app-toast"]', { timeout: 10000 }).should('be.visible');
      cy.url({ timeout: 10000 }).should('include', '/debitAccounts/detail');

      // Go to debit accounts list and open the edit page for the created account
      cy.visit('/debitAccounts/list');
      cy.url({ timeout: 10000 }).should('include', '/debitAccounts/list');

      cy.get('[data-cy="accounts-table"] tbody tr', { timeout: 10000 })
        .last()
        .within(() => {
          cy.get('[data-cy="edit-button"]').should('be.visible').click();
        });

      cy.url({ timeout: 10000 }).should('include', '/debitAccounts/edit');
    });

    it('AC-01: should fail when trying to edit debit account with only whitespaces', () => {
      cy.fixture('accounts').then((accountsData) => {
        const testCase = accountsData.boundaryValues['AC-01'];

        cy.get('[data-cy="input-description"]').clear().type(testCase.description);
        cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

        cy.url({ timeout: 5000 }).should('include', '/debitAccounts/edit');
      });
    });

    it('AC-02: should edit debit account successfully using 3 characters (lower limit)', () => {
      cy.fixture('accounts').then((accountsData) => {
        const testCase = accountsData.boundaryValues['AC-02'];
        const uniqueDescription = `${testCase.description}_${Date.now()}`;

        cy.get('[data-cy="input-description"]').clear().type(uniqueDescription);
        cy.get('[data-cy="save-button"]').should('not.be.disabled').click({ force: true });

        cy.get('[data-cy="app-toast"]', { timeout: 10000 }).should('be.visible');
        cy.url({ timeout: 10000 }).should('include', '/debitAccounts/detail');
      });
    });

    it('AC-03: should edit debit account successfully using 255 characters (upper limit)', () => {
      cy.fixture('accounts').then((accountsData) => {
        const testCase = accountsData.boundaryValues['AC-03'];
        const uniqueDescription = testCase.description.substring(0, 245) + Date.now();

        cy.get('[data-cy="input-description"]').clear().type(uniqueDescription);
        cy.get('[data-cy="save-button"]').should('not.be.disabled').click({ force: true });

        cy.get('[data-cy="app-toast"]', { timeout: 10000 }).should('be.visible');
        cy.url({ timeout: 10000 }).should('include', '/debitAccounts/detail');
      });
    });

    it.skip('AC-04: should fail when trying to edit debit account with 256 characters (exceeds upper limit)', () => {
      cy.fixture('accounts').then((accountsData) => {
        const testCase = accountsData.boundaryValues['AC-04'];

        cy.get('[data-cy="input-description"]').clear().type(testCase.description);
        cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

        cy.url({ timeout: 5000 }).should('include', '/debitAccounts/edit');
      });
    });

    it('AC-05: should edit debit account successfully with valid category', () => {
      cy.get('[data-cy="input-description"]').clear().type(`valid_account_${Date.now()}`);

      cy.get('[data-cy="select-category"]').click();
      cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
      cy.get('[role="option"]').last().click();

      cy.get('[data-cy="save-button"]').should('not.be.disabled').click({ force: true });

      cy.get('[data-cy="app-toast"]', { timeout: 10000 }).should('be.visible');
      cy.url({ timeout: 10000 }).should('include', '/debitAccounts/detail');
    });
  });
});
