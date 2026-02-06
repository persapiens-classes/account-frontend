describe('Credit Account Edit Page', () => {
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
    cy.contains('Credit Account', { timeout: 10000 }).click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/creditAccounts/list');
  });

  it('clicking pencil on last credit account opens edit', () => {
    cy.get('[data-cy="accounts-table"] tbody tr', { timeout: 10000 })
      .last()
      .within(() => {
        cy.get('[data-cy="edit-button"]').should('be.visible').click();
      });

    cy.url({ timeout: 10000 }).should('include', '/creditAccounts/edit');
  });

  it('go back to list using list icon', () => {
    cy.get('[data-cy="accounts-table"] tbody tr', { timeout: 10000 })
      .last()
      .within(() => {
        cy.get('[data-cy="edit-button"]').should('be.visible').click();
      });

    cy.url({ timeout: 10000 }).should('include', '/creditAccounts/edit');

    cy.get('[data-cy="list-button"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/creditAccounts/list');
  });

  it('navigation: clicking magnifying glass on last credit account goes to details', () => {
    cy.get('[data-cy="accounts-table"] tbody tr', { timeout: 10000 })
      .last()
      .within(() => {
        cy.get('[data-cy="detail-button"]').should('be.visible').click();
      });

    cy.url({ timeout: 10000 }).should('include', '/creditAccounts/detail');
  });

  it('edit last credit account by adding _edited to the description', () => {
    cy.get('[data-cy="accounts-table"] tbody tr', { timeout: 10000 })
      .last()
      .find('td')
      .first()
      .invoke('text')
      .then((text) => {
        const originalDescription = text.trim();
        const newDescription = `${originalDescription}_edited`;

        cy.get('[data-cy="accounts-table"] tbody tr', { timeout: 10000 })
          .last()
          .within(() => {
            cy.get('[data-cy="edit-button"]').should('be.visible').click();
          });

        cy.url({ timeout: 10000 }).should('include', '/creditAccounts/edit');

        cy.get('[data-cy="input-description"]', { timeout: 10000 })
          .should('be.visible')
          .clear()
          .type(newDescription);

        cy.get('[data-cy="save-button"]').should('not.be.disabled').click({ force: true });

        cy.url({ timeout: 10000 }).should('include', '/creditAccounts/detail');
        cy.contains(newDescription, { timeout: 10000 }).should('exist');
      });
  });

  describe('Validation Tests', () => {
    const validCreditAccountDescription = `credit_${Date.now()}`;

    beforeEach(() => {
      // Create a credit account first that will be edited in tests
      cy.maybeSetupCategoriesMock();
      cy.visit('/creditAccounts/new');
      cy.get('[data-cy="input-description"]').type(validCreditAccountDescription);

      cy.get('[data-cy="select-category"]').click();
      cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
      cy.get('[role="option"]').last().click();

      cy.get('[data-cy="save-button"]').should('not.be.disabled').click();
      cy.get('[data-cy="app-toast"]', { timeout: 10000 }).should('be.visible');
      cy.url({ timeout: 10000 }).should('include', '/creditAccounts/detail');

      // Go to credit accounts list and open the edit page for the created account
      cy.visit('/creditAccounts/list');
      cy.url({ timeout: 10000 }).should('include', '/creditAccounts/list');

      cy.get('[data-cy="accounts-table"] tbody tr', { timeout: 10000 })
        .last()
        .within(() => {
          cy.get('[data-cy="edit-button"]').should('be.visible').click();
        });

      cy.url({ timeout: 10000 }).should('include', '/creditAccounts/edit');
    });

    it('AC-01: should fail when trying to edit credit account with only whitespaces', () => {
      cy.fixture('accounts').then((accountsData) => {
        const testCase = accountsData.boundaryValues['AC-01'];

        cy.get('[data-cy="input-description"]').clear().type(testCase.description);
        cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

        cy.url({ timeout: 5000 }).should('include', '/creditAccounts/edit');
      });
    });

    it('AC-02: should edit credit account successfully using 3 characters (lower limit)', () => {
      cy.fixture('accounts').then((accountsData) => {
        const testCase = accountsData.boundaryValues['AC-02'];
        const uniqueDescription = `${testCase.description}_${Date.now()}`;

        cy.get('[data-cy="input-description"]').clear().type(uniqueDescription);
        cy.get('[data-cy="save-button"]').should('not.be.disabled').click({ force: true });

        cy.get('[data-cy="app-toast"]', { timeout: 10000 }).should('be.visible');
        cy.url({ timeout: 10000 }).should('include', '/creditAccounts/detail');
      });
    });

    it('AC-03: should edit credit account successfully using 255 characters (upper limit)', () => {
      cy.fixture('accounts').then((accountsData) => {
        const testCase = accountsData.boundaryValues['AC-03'];
        const uniqueDescription = testCase.description;

        cy.get('[data-cy="input-description"]').clear().type(uniqueDescription);
        cy.get('[data-cy="save-button"]').should('not.be.disabled').click({ force: true });

        cy.get('[data-cy="app-toast"]', { timeout: 10000 }).should('be.visible');
        cy.url({ timeout: 10000 }).should('include', '/creditAccounts/detail');
      });
    });

    it.skip('AC-04: should fail when trying to edit credit account with 256 characters (exceeds upper limit)', () => {
      cy.fixture('accounts').then((accountsData) => {
        const testCase = accountsData.boundaryValues['AC-04'];

        cy.get('[data-cy="input-description"]').clear().type(testCase.description);
        cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

        cy.url({ timeout: 5000 }).should('include', '/creditAccounts/edit');
      });
    });

    it('AC-05: should edit credit account successfully with valid category', () => {
      cy.fixture('accounts').then((accountsData) => {
        const testCase = accountsData.boundaryValues['AC-06'];
        const uniqueDescription = `${testCase.description}_${Date.now()}`;

        cy.get('[data-cy="input-description"]').clear().type(uniqueDescription);

        cy.get('[data-cy="select-category"]').click();
        cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
        cy.get('[role="option"]').last().click();

        cy.get('[data-cy="save-button"]').should('not.be.disabled').click({ force: true });

        cy.get('[data-cy="app-toast"]', { timeout: 10000 }).should('be.visible');
        cy.url({ timeout: 10000 }).should('include', '/creditAccounts/detail');
      });
    });
  });
});
