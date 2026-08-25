import { ownerNameBoundaryTestCases } from './owner-boundary-test-cases';
import {
  typeInputNameAndSubmitSaveButtonFail,
  typeInputNameAndSubmitSaveButtonOk,
} from './owner-helpers';

describe('Owner Insert Page', () => {
  const validOwnerName = Cypress._.uniqueId('fabiana_'); // dynamic name to avoid duplicates

  beforeEach(() => {
    cy.maybeSetupApiMock();

    cy.login();

    cy.navigateToOwnersNew();
  });

  it('should allow going back to the list', () => {
    cy.getDataCy('list-button').should('be.visible').click();
    cy.url().should('include', '/owners/list');
  });

  it('should create a new Owner successfully', () => {
    typeInputNameAndSubmitSaveButtonOk(validOwnerName, false);
  });

  describe('Validation Tests', () => {
    it('OW-01: should fail when trying to create owner with name containing only whitespace', () => {
      typeInputNameAndSubmitSaveButtonFail(ownerNameBoundaryTestCases['OW-01'].name);

      cy.url().should('include', '/owners/new');
    });

    it('OW-02: should create owner successfully using 3 characters (lower limit)', () => {
      typeInputNameAndSubmitSaveButtonOk(
        Cypress._.uniqueId(ownerNameBoundaryTestCases['OW-02'].name),
        false,
      );
    });

    it('OW-03: should create owner successfully using 255 characters (upper limit)', () => {
      typeInputNameAndSubmitSaveButtonOk(
        Cypress._.uniqueId(ownerNameBoundaryTestCases['OW-03'].name.substring(0, 245)),
        false,
      );
    });

    // Reason: maxLength does not allow more than 255 characters to be typed in the input, so this test is not applicable
    it.skip('OW-04: should fail when trying to create owner with 256 characters (exceeds upper limit)', () => {
      typeInputNameAndSubmitSaveButtonFail(ownerNameBoundaryTestCases['OW-04'].name);

      cy.url().should('include', '/owners/new');
    });

    it('OW-05: should fail when trying to create owner with duplicate name', () => {
      // Use a unique name for this test to avoid conflicts
      const uniqueDuplicateName = Cypress._.uniqueId('dup_owner_');

      // First create an owner with the unique name
      typeInputNameAndSubmitSaveButtonOk(uniqueDuplicateName);

      // Navigate back to create another with the same name
      cy.navigateToOwnersNew();

      typeInputNameAndSubmitSaveButtonFail(uniqueDuplicateName);

      // Validate that it stays on the creation page due to duplicate error
      cy.url().should('include', '/owners/new');
    });
  });
});
