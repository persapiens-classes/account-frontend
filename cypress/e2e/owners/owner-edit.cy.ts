import {
  goToOwnersListAndFilterOwnerNameAndClickButton,
  submitOwnerNameAndVerifyDetailRoute,
} from './owner-helpers';

function captureLastOwner(): void {
  cy.getDataCy('owners-table-row')
    .last()
    .find('td')
    .first()
    .invoke('text')
    .then((text) => text.trim())
    .as('lastOwnerName');
}

function goToOwnersListAndFilterOwnerNameAndClickEditButton(validOwnerName: string): void {
  goToOwnersListAndFilterOwnerNameAndClickButton(validOwnerName, 'edit');
}

describe('Owner Edit Page', () => {
  beforeEach(() => {
    cy.maybeSetupAuthMock();
    cy.login();

    cy.maybeSetupOwnersMock();
    cy.navigateToOwnersList();
  });

  function clickEditButtonInOwnersTableAndCheckEditRoute() {
    cy.getDataCy('owners-table-row')
      .last()
      .within(() => {
        cy.getDataCy('edit-button').should('be.visible').click();
      });

    cy.url().should('include', '/owners/edit');
  }

  it('clicking pencil on last owner opens edit', () => {
    clickEditButtonInOwnersTableAndCheckEditRoute();
  });

  it('go back to list using list icon', () => {
    clickEditButtonInOwnersTableAndCheckEditRoute();

    cy.getDataCy('list-button').should('be.visible').click();
    cy.url().should('include', '/owners/list');
  });

  it('navigation: clicking magnifying glass on last owner goes to details', () => {
    cy.getDataCy('owners-table-row')
      .last()
      .within(() => {
        cy.getDataCy('detail-button').should('be.visible').click();
      });

    cy.url().should('include', '/owners/detail');
  });

  it('edit last owner by adding _edited to the name', () => {
    captureLastOwner();

    cy.get<string>('@lastOwnerName').then((originalName) => {
      clickEditButtonInOwnersTableAndCheckEditRoute();

      const newName = `${originalName}_edited`;

      cy.getDataCy('input-name').should('be.visible').clear();
      cy.getDataCy('input-name').type(newName);

      cy.getDataCy('save-button').should('not.be.disabled').click();

      cy.url().should('include', '/owners/detail');
      cy.getDataCy('detail-name').should('have.text', newName);
    });
  });

  describe('Validation Tests', () => {
    const validOwnerName = Cypress._.uniqueId('owner_');

    beforeEach(() => {
      // Create an owner first that will be edited in tests
      cy.navigateToOwnersNew();
      cy.getDataCy('input-name').type(validOwnerName);
      cy.getDataCy('save-button').should('not.be.disabled').click();
      cy.getDataCy('app-toast').should('be.visible');
      cy.url().should('include', '/owners/detail');

      goToOwnersListAndFilterOwnerNameAndClickEditButton(validOwnerName);

      cy.url().should('include', '/owners/edit');
    });

    function submitInvalidName(testCaseName: string): void {
      cy.fixture('owners').then((ownersData) => {
        // eslint-disable-next-line security/detect-object-injection
        const testCase = ownersData.boundaryValues[testCaseName];

        cy.getDataCy('input-name').clear();
        cy.getDataCy('input-name').type(testCase.name);
        cy.getDataCy('save-button').should('not.be.disabled').click();

        cy.url().should('include', '/owners/edit');
      });
    }

    it('OW-01: should fail when trying to edit owner with name containing only whitespace', () => {
      submitInvalidName('OW-01');
    });

    it('OW-02: should edit owner successfully using 3 characters (lower limit)', () => {
      submitOwnerNameAndVerifyDetailRoute(
        (ownersData) => Cypress._.uniqueId(ownersData.boundaryValues['OW-02'].name + '_'),
        true,
      );
    });

    it('OW-03: should edit owner successfully using 255 characters (upper limit)', () => {
      submitOwnerNameAndVerifyDetailRoute(
        (ownersData) =>
          Cypress._.uniqueId(ownersData.boundaryValues['OW-03'].name.substring(0, 245)),
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
      cy.getDataCy('input-name').type(duplicateName);
      cy.getDataCy('save-button').should('not.be.disabled').click();
      cy.getDataCy('app-toast').should('be.visible');

      // Go back to edit the original owner with duplicate name
      goToOwnersListAndFilterOwnerNameAndClickEditButton(validOwnerName);

      cy.getDataCy('input-name').clear();
      cy.getDataCy('input-name').type(duplicateName);
      cy.getDataCy('save-button').should('not.be.disabled').click();

      cy.url().should('include', '/owners/edit');
    });
  });
});
