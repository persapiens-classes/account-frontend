import { listPath, newPath } from '../../../src/app/app.paths';
import { CategoryType } from '../../../src/app/category/category';
import { maybeSetupApiMockAndLogin, stringBoundaryTestCases } from '../cy-helpers';
import {
  categoryPath,
  typeInputDescriptionAndSubmitSaveButtonFail,
  typeInputDescriptionAndSubmitSaveButtonOk,
} from './category-helpers';

describe('Category Insert Page', { testIsolation: false }, () => {
  before(() => {
    maybeSetupApiMockAndLogin();
  });

  [CategoryType.CREDIT, CategoryType.DEBIT, CategoryType.EQUITY].forEach((type) => {
    describe(`Type - ${type}`, () => {
      beforeEach(() => {
        cy.maybeSetupApiMock();
        cy.navigateToCategoryNew(type);
      });

      it('should allow going back to the list', () => {
        cy.getDataCy('list-button').should('be.visible').click();
        cy.url().should('include', listPath(categoryPath(type)));
      });

      it('should create a new Category successfully', () => {
        const validCategoryDescription = Cypress._.uniqueId('fabiana_'); // dynamic description to avoid duplicates

        typeInputDescriptionAndSubmitSaveButtonOk(
          type,
          validCategoryDescription,
          validCategoryDescription,
          false,
        );
      });

      describe('Validation Tests', () => {
        it('OW-01: should fail when trying to create category with description containing only whitespace', () => {
          typeInputDescriptionAndSubmitSaveButtonFail(stringBoundaryTestCases['OW-01']);

          cy.url().should('include', newPath(categoryPath(type)));
        });

        it('OW-02: should create category successfully using 3 characters (lower limit)', () => {
          const valueToSubmit = Cypress._.uniqueId(stringBoundaryTestCases['OW-02']);
          typeInputDescriptionAndSubmitSaveButtonOk(type, valueToSubmit, valueToSubmit, false);
        });

        it('OW-03: should create category successfully using 255 characters (upper limit)', () => {
          const valueToSubmit = Cypress._.uniqueId(
            stringBoundaryTestCases['OW-03'].substring(0, 245),
          );
          typeInputDescriptionAndSubmitSaveButtonOk(type, valueToSubmit, valueToSubmit, false);
        });

        // Reason: maxLength does not allow more than 255 characters to be typed in the input
        it('OW-04: maxLength should not fix when trying to create category with 256 characters (exceeds upper limit)', () => {
          const valueToSubmit = stringBoundaryTestCases['OW-04'];
          const savedValue = valueToSubmit.substring(0, 255); // maxLength should fix it to 255 characters
          typeInputDescriptionAndSubmitSaveButtonOk(type, valueToSubmit, savedValue);
        });

        it('OW-05: should fail when trying to create category with duplicate description', () => {
          // Use a unique description for this test to avoid conflicts
          const uniqueDuplicateDescription = Cypress._.uniqueId('dup_category_');

          // First create an category with the unique description
          typeInputDescriptionAndSubmitSaveButtonOk(
            type,
            uniqueDuplicateDescription,
            uniqueDuplicateDescription,
          );

          // Navigate back to create another with the same description
          cy.navigateToCategoryNew(type);

          typeInputDescriptionAndSubmitSaveButtonFail(uniqueDuplicateDescription);

          // Validate that it stays on the creation page due to duplicate error
          cy.url().should('include', newPath(categoryPath(type)));
        });
      });
    });
  });
});
