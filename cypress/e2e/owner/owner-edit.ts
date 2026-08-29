import { detailPath, editPath, listPath, PATHS } from '../../../src/app/app.paths';
import { MAX_LENGTH } from '../../../src/app/models/models';
import { clickEditButtonInTableRowAndCheckEditRoute, stringBoundaryTestCases } from '../cy-helpers';
import {
  goToOwnerListAndFilterOwnerNameAndClickButton,
  typeInputNameAndSubmitSaveButtonFail,
  typeInputNameAndSubmitSaveButtonOk,
} from './owner-helpers';

function goToOwnersListAndFilterOwnerNameAndClickEditButton(validOwnerName: string): void {
  goToOwnerListAndFilterOwnerNameAndClickButton(validOwnerName, 'edit');
}

function clickEditButtonInOwnersTableRowAndCheckEditRoute(index: number) {
  clickEditButtonInTableRowAndCheckEditRoute('owners-table-row', PATHS.OWNER_PATH, index);
}

export function ownerEditTests() {
  describe('Owner Edit Page', { testIsolation: false }, () => {
    beforeEach(() => {
      cy.maybeSetupApiMock();
      cy.navigateToOwnerList();
    });

    it('clicking pencil on first owner opens edit', () => {
      clickEditButtonInOwnersTableRowAndCheckEditRoute(0);
    });

    it('go back to list using list icon', () => {
      clickEditButtonInOwnersTableRowAndCheckEditRoute(0);

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

    it('edit second owner by adding _edited to the name', () => {
      cy.ownersDefault().then((owners) => {
        const index = 1;
        clickEditButtonInOwnersTableRowAndCheckEditRoute(index);

        const newName = `${owners.at(index)!.name}_edited`;

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

      it('OW-01: should fail when trying to edit owner with name containing only whitespace', () => {
        const testCase = stringBoundaryTestCases['OW-01'];

        typeInputNameAndSubmitSaveButtonFail(testCase, editPath(PATHS.OWNER_PATH), true);
      });

      it('OW-02: should edit owner successfully using 3 characters (lower limit)', () => {
        const valueToSubmit = Cypress._.uniqueId(stringBoundaryTestCases['OW-02'] + '_');
        typeInputNameAndSubmitSaveButtonOk(valueToSubmit, valueToSubmit, true);
      });

      it(`OW-03: should edit owner successfully using ${MAX_LENGTH} characters (upper limit)`, () => {
        const valueToSubmit = Cypress._.uniqueId(
          stringBoundaryTestCases['OW-03'].substring(0, MAX_LENGTH - 10),
        );
        typeInputNameAndSubmitSaveButtonOk(valueToSubmit, valueToSubmit, true);
      });

      // Reason: maxLength does not allow more than MAX_LENGTH characters to be typed in the input
      it(`OW-04: should fail when trying to edit owner with ${MAX_LENGTH + 1} characters (exceeds upper limit)`, () => {
        const valueToSubmit = stringBoundaryTestCases['OW-04'];
        const savedValue = valueToSubmit.substring(0, MAX_LENGTH); // maxLength should fix it to MAX_LENGTH characters
        typeInputNameAndSubmitSaveButtonOk(valueToSubmit, savedValue, true);
      });

      it('OW-05: should fail when trying to edit owner with existing name', () => {
        const duplicateName = Cypress._.uniqueId('dup_');

        // Create another owner first
        cy.navigateToOwnerNew();
        typeInputNameAndSubmitSaveButtonOk(duplicateName, duplicateName);

        // Go back to edit the original owner with duplicate name
        goToOwnersListAndFilterOwnerNameAndClickEditButton(validOwnerName);
        typeInputNameAndSubmitSaveButtonFail(duplicateName, editPath(PATHS.OWNER_PATH), true);
      });
    });
  });
}
