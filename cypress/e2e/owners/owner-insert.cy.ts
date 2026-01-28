describe('Owner Insert Page', () => {
  const validOwnerName = `fabiana_${Date.now()}`; // dynamic name to avoid duplicates

  beforeEach(() => {
    // Reset created owners state for mock
    Cypress.env('createdOwners', []);

    cy.session('login', () => {
      cy.maybeSetupAuthMock();
      cy.login();
    });

    cy.maybeSetupOwnersMock();
    cy.visit('/balances/list');

    // Path to owner creation page
    cy.contains('Owner', ).should('be.visible').click();
    cy.url().should('include', '/owners/list');
    cy.get('[data-cy="create-button"]').should('be.visible').click();
    cy.url().should('include', '/owners/new');
  });

  it('should allow going back to the list', () => {
    cy.get('[data-cy="list-button"]').should('be.visible').click();
    cy.url().should('include', '/owners/list');
  });

  it('should create a new Owner successfully', () => {
    cy.get('[data-cy="input-name"]').type(validOwnerName);
    cy.get('[data-cy="save-button"]').should('not.be.disabled').click();
    cy.get('[data-cy="app-toast"]').should('be.visible');
    cy.url().should('include', '/owners/detail');
  });

  describe('Validation Tests', () => {
    it('OW-01: should fail when trying to create owner with name containing only whitespace', () => {
      cy.fixture('owners').then((ownersData) => {
        const testCase = ownersData.boundaryValues['OW-01'];

        cy.get('[data-cy="input-name"]').type(testCase.name);
        cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

        cy.url().should('include', '/owners/new');
      });
    });

    it('OW-02: should create owner successfully using 3 characters (lower limit)', () => {
      cy.fixture('owners').then((ownersData) => {
        const testCase = ownersData.boundaryValues['OW-02'];
        const uniqueName = `${testCase.name}_${Date.now()}`;

        cy.get('[data-cy="input-name"]').type(uniqueName);
        cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

        cy.get('[data-cy="app-toast"]', ).should('be.visible');
        cy.url().should('include', '/owners/detail');
      });
    });

    it('OW-03: should create owner successfully using 255 characters (upper limit)', () => {
      cy.fixture('owners').then((ownersData) => {
        const testCase = ownersData.boundaryValues['OW-03'];
        const uniqueName = testCase.name.substring(0, 245) + Date.now();

        cy.get('[data-cy="input-name"]').type(uniqueName);
        cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

        cy.get('[data-cy="app-toast"]', ).should('be.visible');
        cy.url().should('include', '/owners/detail');
      });
    });

    it.skip('OW-04: should fail when trying to create owner with 256 characters (exceeds upper limit)', () => {
      cy.fixture('owners').then((ownersData) => {
        const testCase = ownersData.boundaryValues['OW-04'];

        cy.get('[data-cy="input-name"]').type(testCase.name);
        cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

        cy.url().should('include', '/owners/new');
      });
    });

    it('OW-05: should fail when trying to create owner with duplicate name', () => {
      // Use a unique name for this test to avoid conflicts
      const uniqueDuplicateName = `dup_owner_${Date.now()}`;

      // First create an owner with the unique name
      cy.get('[data-cy="input-name"]').type(uniqueDuplicateName);
      cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

      cy.get('[data-cy="app-toast"]', ).should('be.visible');
      cy.url().should('include', '/owners/detail');

      // Navigate back to create another with the same name
      cy.visit('/owners/new');
      cy.url().should('include', '/owners/new');

      cy.get('[data-cy="input-name"]').type(uniqueDuplicateName);
      cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

      // Validate that it stays on the creation page due to duplicate error
      cy.url().should('include', '/owners/new');
    });
  });
});
