import { listPath, newPath } from '../../../src/app/app.paths';
import { AccountType } from '../../../src/app/account/account';
import { maybeSetupApiMockAndLogin, stringBoundaryTestCases } from '../cy-helpers';
import {
  accountPath,
  typeDescriptionSelectCategoryAndSubmitSaveButtonFail,
  typeDescriptionSelectCategoryAndSubmitSaveButtonOk,
} from './account-helpers';

describe('Account Insert Page', { testIsolation: false }, () => {
  before(() => {
    maybeSetupApiMockAndLogin();
  });

  [AccountType.CREDIT, AccountType.DEBIT, AccountType.EQUITY].forEach((type) => {
    describe(`Type - ${type}`, () => {
      beforeEach(() => {
        cy.maybeSetupApiMock();
        cy.navigateToAccountNew(type);
      });

      it('should allow going back to the list', () => {
        cy.getDataCy('list-button').should('be.visible').click();
        cy.url().should('include', listPath(accountPath(type)));
      });

      it('should create a new Account successfully', () => {
        const validAccountDescription = Cypress._.uniqueId('fabiana_'); // dynamic description to avoid duplicates

        typeDescriptionSelectCategoryAndSubmitSaveButtonOk(
          type,
          validAccountDescription,
          0,
          validAccountDescription,
          false,
        );
      });

      describe('Validation Tests', () => {
        it('OW-01: should fail when trying to create account with description containing only whitespace', () => {
          typeDescriptionSelectCategoryAndSubmitSaveButtonFail(
            stringBoundaryTestCases['OW-01'],
            0,
            false,
          );

          cy.url().should('include', newPath(accountPath(type)));
        });

        it('OW-02: should create account successfully using 3 characters (lower limit)', () => {
          const description = Cypress._.uniqueId(stringBoundaryTestCases['OW-02']);
          typeDescriptionSelectCategoryAndSubmitSaveButtonOk(
            type,
            description,
            0,
            description,
            false,
          );
        });

        it('OW-03: should create account successfully using 255 characters (upper limit)', () => {
          const valueToSubmit = Cypress._.uniqueId(
            stringBoundaryTestCases['OW-03'].substring(0, 245),
          );
          typeDescriptionSelectCategoryAndSubmitSaveButtonOk(
            type,
            valueToSubmit,
            0,
            valueToSubmit,
            false,
          );
        });

        // Reason: maxLength does not allow more than 255 characters to be typed in the input
        it('OW-04: maxLength should not fix when trying to create account with 256 characters (exceeds upper limit)', () => {
          const valueToSubmit = stringBoundaryTestCases['OW-04'];
          const savedValue = valueToSubmit.substring(0, 255); // maxLength should fix it to 255 characters
          typeDescriptionSelectCategoryAndSubmitSaveButtonOk(type, valueToSubmit, 0, savedValue);
        });

        it('OW-05: should fail when trying to create account with duplicate description', () => {
          // Use a unique description for this test to avoid conflicts
          const uniqueDuplicateDescription = Cypress._.uniqueId('dup_account_');

          // First create an account with the unique description
          typeDescriptionSelectCategoryAndSubmitSaveButtonOk(
            type,
            uniqueDuplicateDescription,
            0,
            uniqueDuplicateDescription,
            false,
          );

          // Navigate back to create another with the same description
          cy.navigateToAccountNew(type);

          typeDescriptionSelectCategoryAndSubmitSaveButtonFail(
            uniqueDuplicateDescription,
            0,
            false,
          );

          // Validate that it stays on the creation page due to duplicate error
          cy.url().should('include', newPath(accountPath(type)));
        });
      });
    });
  });
});
