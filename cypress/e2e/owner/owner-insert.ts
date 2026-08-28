import { listPath, newPath, PATHS } from '../../../src/app/app.paths';
import { stringBoundaryTestCases } from '../cy-helpers';
import {
  typeInputNameAndSubmitSaveButtonFail,
  typeInputNameAndSubmitSaveButtonOk,
} from './owner-helpers';

export function ownerInsertTests() {
  describe('Owner Insert Page', { testIsolation: false }, () => {
    beforeEach(() => {
      cy.maybeSetupApiMock();
      cy.navigateToOwnerNew();
    });

    it('should allow going back to the list', () => {
      cy.getDataCy('list-button').should('be.visible').click();
      cy.url().should('include', listPath(PATHS.OWNER_PATH));
    });

    it('should create a new Owner successfully', () => {
      const validOwnerName = Cypress._.uniqueId('fabiana_'); // dynamic name to avoid duplicates

      typeInputNameAndSubmitSaveButtonOk(validOwnerName, validOwnerName, false);
    });

    describe('Validation Tests', () => {
      it('OW-01: should fail when trying to create owner with name containing only whitespace', () => {
        typeInputNameAndSubmitSaveButtonFail(
          stringBoundaryTestCases['OW-01'],
          newPath(PATHS.OWNER_PATH),
        );
      });

      it('OW-02: should create owner successfully using 3 characters (lower limit)', () => {
        const valueToSubmit = Cypress._.uniqueId(stringBoundaryTestCases['OW-02']);
        typeInputNameAndSubmitSaveButtonOk(valueToSubmit, valueToSubmit, false);
      });

      it('OW-03: should create owner successfully using 255 characters (upper limit)', () => {
        const valueToSubmit = Cypress._.uniqueId(
          stringBoundaryTestCases['OW-03'].substring(0, 245),
        );
        typeInputNameAndSubmitSaveButtonOk(valueToSubmit, valueToSubmit, false);
      });

      // Reason: maxLength does not allow more than 255 characters to be typed in the input
      it('OW-04: maxLength should not fix when trying to create owner with 256 characters (exceeds upper limit)', () => {
        const valueToSubmit = stringBoundaryTestCases['OW-04'];
        const savedValue = valueToSubmit.substring(0, 255); // maxLength should fix it to 255 characters
        typeInputNameAndSubmitSaveButtonOk(valueToSubmit, savedValue);
      });

      it('OW-05: should fail when trying to create owner with duplicate name', () => {
        // Use a unique name for this test to avoid conflicts
        const uniqueDuplicateName = Cypress._.uniqueId('dup_owner_');

        // First create an owner with the unique name
        typeInputNameAndSubmitSaveButtonOk(uniqueDuplicateName, uniqueDuplicateName);

        // Navigate back to create another with the same name
        cy.navigateToOwnerNew();

        typeInputNameAndSubmitSaveButtonFail(uniqueDuplicateName, newPath(PATHS.OWNER_PATH));
      });
    });
  });
}
