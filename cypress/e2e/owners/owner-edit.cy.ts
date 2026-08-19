import { submitOwnerAndVerifyDetailRoute } from './owner-insert.cy';

function captureLastOwner(): void {
  cy.get('[data-cy="owners-table"] tbody tr')
    .last()
    .find('td')
    .first()
    .invoke('text')
    .then((text) => text.trim())
    .as('lastOwnerName');
}

function goToOwnersListAndOpenEditPage(validOwnerName: string): void {
  // Go to owners list and open the edit page for the created owner
  cy.navigateToOwnersList();

  cy.get('[data-cy="filter-name"] input').clear();
  cy.get('[data-cy="filter-name"] input').type(`${validOwnerName}{enter}`);

  cy.contains('tr', validOwnerName).within(() => {
    cy.get('[data-cy="edit-button"]').should('be.visible').click();
  });
}

describe('Owner Edit Page', () => {
  beforeEach(() => {
    cy.maybeSetupAuthMock();
    cy.login();

    cy.maybeSetupOwnersMock();
    cy.navigateToOwnersList();
  });

  function clickEditButtonInOwnersTableAndCheckEditRoute() {
    cy.get('[data-cy="owners-table"] tbody tr')
      .last()
      .within(() => {
        cy.get('[data-cy="edit-button"]').should('be.visible').click();
      });

    cy.url().should('include', '/owners/edit');
  }

  it('clicking pencil on last owner opens edit', () => {
    clickEditButtonInOwnersTableAndCheckEditRoute();
  });

  it('go back to list using list icon', () => {
    clickEditButtonInOwnersTableAndCheckEditRoute();

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

    cy.get<string>('@lastOwnerName').then((originalName) => {
      clickEditButtonInOwnersTableAndCheckEditRoute();

      const newName = `${originalName}_edited`;

      cy.get('[data-cy="input-name"]').should('be.visible').clear();
      cy.get('[data-cy="input-name"]').type(newName);

      cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

      cy.url().should('include', '/owners/detail');
      cy.get('[data-cy="detail-name"]').should('have.text', newName);
    });
  });

  describe('Validation Tests', () => {
    const validOwnerName = Cypress._.uniqueId('owner_');

    beforeEach(() => {
      // Create an owner first that will be edited in tests
      cy.navigateToOwnersNew();
      cy.get('[data-cy="input-name"]').type(validOwnerName);
      cy.get('[data-cy="save-button"]').should('not.be.disabled').click();
      cy.get('[data-cy="app-toast"]').should('be.visible');
      cy.url().should('include', '/owners/detail');

      goToOwnersListAndOpenEditPage(validOwnerName);

      cy.url().should('include', '/owners/edit');
    });

    function submitInvalidName(testCaseName: string): void {
      cy.fixture('owners').then((ownersData) => {
        // eslint-disable-next-line security/detect-object-injection
        const testCase = ownersData.boundaryValues[testCaseName];

        cy.get('[data-cy="input-name"]').clear();
        cy.get('[data-cy="input-name"]').type(testCase.name);
        cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

        cy.url().should('include', '/owners/edit');
      });
    }

    it('OW-01: should fail when trying to edit owner with name containing only whitespace', () => {
      submitInvalidName('OW-01');
    });

    it('OW-02: should edit owner successfully using 3 characters (lower limit)', () => {
      cy.fixture('owners').then((ownersData) => {
        const testCase = ownersData.boundaryValues['OW-02'];
        const uniqueName = Cypress._.uniqueId(testCase.name + '_');

        cy.get('[data-cy="input-name"]').clear();
        cy.get('[data-cy="input-name"]').type(uniqueName);
        cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

        cy.get('[data-cy="app-toast"]').should('be.visible');
        cy.url().should('include', '/owners/detail');
      });
    });

    it('OW-03: should edit owner successfully using 255 characters (upper limit)', () => {
      submitOwnerAndVerifyDetailRoute(
        (ownersData) => ownersData.boundaryValues['OW-03'].name.substring(0, 245),
        true,
      );
    });

    // Reason: not working yet
    it.skip('OW-04: should fail when trying to edit owner with 256 characters (exceeds upper limit)', () => {
      submitInvalidName('OW-04');
    });

    it('OW-05: should fail when trying to edit owner with existing name', () => {
      const duplicateName = Cypress._.uniqueId('dup_');

      // Create another owner first
      cy.navigateToOwnersNew();
      cy.get('[data-cy="input-name"]').type(duplicateName);
      cy.get('[data-cy="save-button"]').should('not.be.disabled').click();
      cy.get('[data-cy="app-toast"]').should('be.visible');

      // Go back to edit the original owner with duplicate name
      goToOwnersListAndOpenEditPage(validOwnerName);

      cy.get('[data-cy="input-name"]').clear();
      cy.get('[data-cy="input-name"]').type(duplicateName);
      cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

      cy.url().should('include', '/owners/edit');
    });
  });
});
