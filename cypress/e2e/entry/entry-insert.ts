import { listPath, newPath } from '../../../src/app/app.paths';
import { EntryType } from '../../../src/app/entry/entry';
import { maybeSetupApiMockAndLogin, stringBoundaryTestCases } from '../cy-helpers';
import {
  entryPath,
  fillEntryFieldsAndSubmitSaveButtonOk,
  fillEntryFieldsAndSubmitSaveButtonFail,
} from './entry-helpers';

describe('Entry Insert Page', { testIsolation: false }, () => {
  before(() => {
    maybeSetupApiMockAndLogin();
  });

  [EntryType.CREDIT, EntryType.DEBIT, EntryType.TRANSFER].forEach((type) => {
    describe(`Type - ${type}`, () => {
      beforeEach(() => {
        cy.maybeSetupApiMock();
        cy.navigateToEntryNew(type);
      });

      it('should allow going back to the list', () => {
        cy.getDataCy('list-button').should('be.visible').click();
        cy.url().should('include', listPath(entryPath(type)));
      });

      it('should create a new Entry successfully', () => {
        const validEntryDescription = Cypress._.uniqueId('fabiana_'); // dynamic description to avoid duplicates

        fillEntryFieldsAndSubmitSaveButtonOk(
          type,
          validEntryDescription,
          0,
          validEntryDescription,
          false,
        );
      });

      describe('Validation Tests', () => {
        it('OW-01: should fail when trying to create entry with description containing only whitespace', () => {
          fillEntryFieldsAndSubmitSaveButtonFail(stringBoundaryTestCases['OW-01'], 0, false);

          cy.url().should('include', newPath(entryPath(type)));
        });

        it('OW-02: should create entry successfully using 3 characters (lower limit)', () => {
          const description = Cypress._.uniqueId(stringBoundaryTestCases['OW-02']);
          fillEntryFieldsAndSubmitSaveButtonOk(type, description, 0, description, false);
        });

        it('OW-03: should create entry successfully using 255 characters (upper limit)', () => {
          const valueToSubmit = Cypress._.uniqueId(
            stringBoundaryTestCases['OW-03'].substring(0, 245),
          );
          fillEntryFieldsAndSubmitSaveButtonOk(type, valueToSubmit, 0, valueToSubmit, false);
        });

        // Reason: maxLength does not allow more than 255 characters to be typed in the input
        it('OW-04: maxLength should not fix when trying to create entry with 256 characters (exceeds upper limit)', () => {
          const valueToSubmit = stringBoundaryTestCases['OW-04'];
          const savedValue = valueToSubmit.substring(0, 255); // maxLength should fix it to 255 characters
          fillEntryFieldsAndSubmitSaveButtonOk(type, valueToSubmit, 0, savedValue);
        });

        it('OW-05: should fail when trying to create entry with duplicate description', () => {
          // Use a unique description for this test to avoid conflicts
          const uniqueDuplicateDescription = Cypress._.uniqueId('dup_entry_');

          // First create an entry with the unique description
          fillEntryFieldsAndSubmitSaveButtonOk(
            type,
            uniqueDuplicateDescription,
            0,
            uniqueDuplicateDescription,
            false,
          );

          // Navigate back to create another with the same description
          cy.navigateToEntryNew(type);

          fillEntryFieldsAndSubmitSaveButtonFail(uniqueDuplicateDescription, 0, false);

          // Validate that it stays on the creation page due to duplicate error
          cy.url().should('include', newPath(entryPath(type)));
        });
      });
    });
  });
});
