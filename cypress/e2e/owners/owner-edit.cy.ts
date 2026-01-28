function captureLastOwner(): void {
  cy.get('[data-cy="owners-table"] tbody tr')
    .last()
    .find('td')
    .first()
    .invoke('text')
    .then((text) => text.trim())
    .as('lastOwnerName');
}

describe('Owner Edit Page', () => {
  beforeEach(() => {
    // Reset created owners state for mock
    Cypress.env('createdOwners', []);

    cy.session('login', () => {
      cy.maybeSetupAuthMock();
      cy.login();
    });

    cy.maybeSetupOwnersMock();
    cy.visit('/balances/list');

    // Navigate to owners list
    cy.contains('Owner').should('be.visible').click();
    cy.url().should('include', '/owners/list');
  });

  it('clicking pencil on last owner opens edit', () => {
    cy.get('[data-cy="owners-table"] tbody tr')
      .last()
      .within(() => {
        cy.get('[data-cy="edit-button"]').should('be.visible').click();
      });

    cy.url().should('include', '/owners/edit');
  });

  it('go back to list using list icon', () => {
    cy.get('[data-cy="owners-table"] tbody tr')
      .last()
      .within(() => {
        cy.get('[data-cy="edit-button"]').should('be.visible').click();
      });

    cy.url().should('include', '/owners/edit');

    cy.get('[data-cy="list-button"]').should('be.visible').click();
    cy.url().should('include', '/owners/list');
  });

  it('navigation: clicking magnifying glass on last owner goes to details', () => {
    cy.get('[data-cy="owners-table"] tbody tr')
      .last()
      .within(() => {
        cy.get('[data-cy="detail-button"]').should('be.visible').click();
      });

    cy.url().should('include', '/owners/detail');
  });

  it('edit last owner by adding _edited to the name', () => {
    captureLastOwner();

    cy.get('@lastOwnerName').then((originalName) => {
      cy.get('[data-cy="owners-table"] tbody tr')
        .last()
        .within(() => {
          cy.get('[data-cy="edit-button"]').should('be.visible').click();
        });

      cy.url().should('include', '/owners/edit');

      const newName = `${originalName}_edited`;

      cy.get('[data-cy="input-name"]').should('be.visible').clear().type(newName);

      cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

      cy.url().should('include', '/owners/detail');
      cy.contains(newName).should('exist');
    });
  });

  describe('Validation Tests', () => {
    const validOwnerName = `owner_${Date.now()}`;

    beforeEach(() => {
      // Create an owner first that will be edited in tests
      cy.visit('/owners/new');
      cy.get('[data-cy="input-name"]').type(validOwnerName);
      cy.get('[data-cy="save-button"]').should('not.be.disabled').click();
      cy.get('[data-cy="app-toast"]').should('be.visible');
      cy.url().should('include', '/owners/detail');

      // Go to owners list and open the edit page for the created owner
      cy.visit('/owners/list');
      cy.url().should('include', '/owners/list');

      cy.get('[data-cy="filter-name"] input')
        .clear({ force: true })
        .type(`${validOwnerName}{enter}`);

      cy.contains('tr', validOwnerName).within(() => {
        cy.get('[data-cy="edit-button"]').should('be.visible').click();
      });

      cy.url().should('include', '/owners/edit');
    });

    it('OW-01: should fail when trying to edit owner with name containing only whitespace', () => {
      cy.fixture('owners').then((ownersData) => {
        const testCase = ownersData.boundaryValues['OW-01'];

        cy.get('[data-cy="input-name"]').clear().type(testCase.name);
        cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

        cy.url().should('include', '/owners/edit');
      });
    });

    it('OW-02: should edit owner successfully using 3 characters (lower limit)', () => {
      cy.fixture('owners').then((ownersData) => {
        const testCase = ownersData.boundaryValues['OW-02'];
        const uniqueName = `${testCase.name}_${Date.now()}`;

        cy.get('[data-cy="input-name"]').clear().type(uniqueName);
        cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

        cy.get('[data-cy="app-toast"]').should('be.visible');
        cy.url().should('include', '/owners/detail');
      });
    });

    it('OW-03: should edit owner successfully using 255 characters (upper limit)', () => {
      cy.fixture('owners').then((ownersData) => {
        const testCase = ownersData.boundaryValues['OW-03'];
        const uniqueName = testCase.name.substring(0, 245) + Date.now();

        cy.get('[data-cy="input-name"]').clear().type(uniqueName);
        cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

        cy.get('[data-cy="app-toast"]').should('be.visible');
        cy.url().should('include', '/owners/detail');
      });
    });

    it.skip('OW-04: should fail when trying to edit owner with 256 characters (exceeds upper limit)', () => {
      cy.fixture('owners').then((ownersData) => {
        const testCase = ownersData.boundaryValues['OW-04'];

        cy.get('[data-cy="input-name"]').clear().type(testCase.name);
        cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

        cy.url().should('include', '/owners/edit');
      });
    });

    it('OW-05: should fail when trying to edit owner with existing name', () => {
      const duplicateName = `dup_${Date.now()}`;

      // Create another owner first
      cy.visit('/owners/new');
      cy.get('[data-cy="input-name"]').type(duplicateName);
      cy.get('[data-cy="save-button"]').should('not.be.disabled').click();
      cy.get('[data-cy="app-toast"]').should('be.visible');

      // Go back to edit the original owner with duplicate name
      cy.visit('/owners/list');
      cy.get('[data-cy="filter-name"] input')
        .clear({ force: true })
        .type(`${validOwnerName}{enter}`);
      cy.contains('tr', validOwnerName).within(() => {
        cy.get('[data-cy="edit-button"]').should('be.visible').click();
      });

      cy.get('[data-cy="input-name"]').clear().type(duplicateName);
      cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

      cy.url().should('include', '/owners/edit');
    });
  });
});
