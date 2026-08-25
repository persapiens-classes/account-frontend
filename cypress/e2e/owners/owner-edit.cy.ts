import { ownerNameBoundaryTestCases } from './owner-boundary-test-cases';
import {
  goToOwnersListAndFilterOwnerNameAndClickButton,
  typeInputNameAndSubmitSaveButtonFail,
  typeInputNameAndSubmitSaveButtonOk,
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
    cy.maybeSetupApiMock();

    cy.login();

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

      typeInputNameAndSubmitSaveButtonOk(newName, true);
    });
  });

  describe('Validation Tests', () => {
    const validOwnerName = Cypress._.uniqueId('owner_');

    beforeEach(() => {
      // Create an owner first that will be edited in tests
      cy.navigateToOwnersNew();

      typeInputNameAndSubmitSaveButtonOk(validOwnerName);

      goToOwnersListAndFilterOwnerNameAndClickEditButton(validOwnerName);

      cy.url().should('include', '/owners/edit');
    });

    function submitInvalidName(testCaseName: string): void {
      // eslint-disable-next-line security/detect-object-injection
      const testCase = ownerNameBoundaryTestCases[testCaseName];

      typeInputNameAndSubmitSaveButtonFail(testCase.name, true);

      cy.url().should('include', '/owners/edit');
    }

    it('OW-01: should fail when trying to edit owner with name containing only whitespace', () => {
      submitInvalidName('OW-01');
    });

    it('OW-02: should edit owner successfully using 3 characters (lower limit)', () => {
      typeInputNameAndSubmitSaveButtonOk(
        Cypress._.uniqueId(ownerNameBoundaryTestCases['OW-02'].name + '_'),
        true,
      );
    });

    it('OW-03: should edit owner successfully using 255 characters (upper limit)', () => {
      typeInputNameAndSubmitSaveButtonOk(
        Cypress._.uniqueId(ownerNameBoundaryTestCases['OW-03'].name.substring(0, 245)),
        true,
      );
    });

    // Reason: maxLength does not allow more than 255 characters to be typed in the input, so this test is not applicable
    it.skip('OW-04: should fail when trying to edit owner with 256 characters (exceeds upper limit)', () => {
      submitInvalidName('OW-04');
    });

    it('OW-05: should fail when trying to edit owner with existing name', () => {
      const duplicateName = Cypress._.uniqueId('dup_');

      // Create another owner first
      cy.navigateToOwnersNew();
      typeInputNameAndSubmitSaveButtonOk(duplicateName);

      // Go back to edit the original owner with duplicate name
      goToOwnersListAndFilterOwnerNameAndClickEditButton(validOwnerName);
      typeInputNameAndSubmitSaveButtonFail(duplicateName, true);

      cy.url().should('include', '/owners/edit');
    });
  });
});
