import { detailPath, editPath, listPath, PATHS } from '../../../src/app/app.paths';
import {
  clickEditButtonInTableRowAndCheckEditRoute,
  stringBoundaryTestCases,
} from '../cy-helpers';
import {
  goToOwnerListAndFilterOwnerNameAndClickButton,
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
  goToOwnerListAndFilterOwnerNameAndClickButton(validOwnerName, 'edit');
}

describe('Owner Edit Page', { testIsolation: false }, () => {
  beforeEach(() => {
    cy.maybeSetupApiMock();
    cy.navigateToOwnerList();
  });

  function clickEditButtonInOwnersTableRowAndCheckEditRoute() {
    clickEditButtonInTableRowAndCheckEditRoute('owners-table-row', PATHS.OWNER_PATH);
  }

  it('clicking pencil on last owner opens edit', () => {
    clickEditButtonInOwnersTableRowAndCheckEditRoute();
  });

  it('go back to list using list icon', () => {
    clickEditButtonInOwnersTableRowAndCheckEditRoute();

    cy.getDataCy('list-button').should('be.visible').click();
    cy.url().should('include', listPath(PATHS.OWNER_PATH));
  });

  it('navigation: clicking magnifying glass on last owner goes to details', () => {
    cy.getDataCy('owners-table-row')
      .last()
      .within(() => {
        cy.getDataCy('detail-button').should('be.visible').click();
      });

    cy.url().should('include', detailPath(PATHS.OWNER_PATH));
  });

  it('edit last owner by adding _edited to the name', () => {
    captureLastOwner();

    cy.get<string>('@lastOwnerName').then((originalName) => {
      clickEditButtonInOwnersTableRowAndCheckEditRoute();

      const newName = `${originalName}_edited`;

      typeInputNameAndSubmitSaveButtonOk(newName, newName, true);
    });
  });

  describe('Validation Tests', () => {
    const validOwnerName = Cypress._.uniqueId('owner_');

    beforeEach(() => {
      // Create an owner first that will be edited in tests
      cy.navigateToOwnerNew();

      typeInputNameAndSubmitSaveButtonOk(validOwnerName, validOwnerName);

      goToOwnersListAndFilterOwnerNameAndClickEditButton(validOwnerName);

      cy.url().should('include', editPath(PATHS.OWNER_PATH));
    });

    function submitInvalidName(testCaseName: string): void {
      // eslint-disable-next-line security/detect-object-injection
      const testCase = stringBoundaryTestCases[testCaseName];

      typeInputNameAndSubmitSaveButtonFail(testCase, true);

      cy.url().should('include', editPath(PATHS.OWNER_PATH));
    }

    it('OW-01: should fail when trying to edit owner with name containing only whitespace', () => {
      submitInvalidName('OW-01');
    });

    it('OW-02: should edit owner successfully using 3 characters (lower limit)', () => {
      const valueToSubmit = Cypress._.uniqueId(stringBoundaryTestCases['OW-02'] + '_');
      typeInputNameAndSubmitSaveButtonOk(valueToSubmit, valueToSubmit, true);
    });

    it('OW-03: should edit owner successfully using 255 characters (upper limit)', () => {
      const valueToSubmit = Cypress._.uniqueId(stringBoundaryTestCases['OW-03'].substring(0, 245));
      typeInputNameAndSubmitSaveButtonOk(valueToSubmit, valueToSubmit, true);
    });

    // Reason: maxLength does not allow more than 255 characters to be typed in the input
    it('OW-04: should fail when trying to edit owner with 256 characters (exceeds upper limit)', () => {
      const valueToSubmit = stringBoundaryTestCases['OW-04'];
      const savedValue = valueToSubmit.substring(0, 255); // maxLength should fix it to 255 characters
      typeInputNameAndSubmitSaveButtonOk(valueToSubmit, savedValue, true);
    });

    it('OW-05: should fail when trying to edit owner with existing name', () => {
      const duplicateName = Cypress._.uniqueId('dup_');

      // Create another owner first
      cy.navigateToOwnerNew();
      typeInputNameAndSubmitSaveButtonOk(duplicateName, duplicateName);

      // Go back to edit the original owner with duplicate name
      goToOwnersListAndFilterOwnerNameAndClickEditButton(validOwnerName);
      typeInputNameAndSubmitSaveButtonFail(duplicateName, true);

      cy.url().should('include', editPath(PATHS.OWNER_PATH));
    });
  });
});
