import { detailPath, editPath } from '../../../src/app/app.paths';
import { CategoryType } from '../../../src/app/category/category';
import {
  clickEditButtonInTableRowAndCheckEditRoute,
  clickListButtonAndVerifyListUrl,
  maybeSetupApiMockAndLogin,
  stringBoundaryTestCases,
} from '../cy-helpers';
import {
  categoryPath,
  goToCategoryListAndFilterCategoryDescriptionAndClickButton,
  maybeSetupApiMockAndNatigateToCategoriesList,
  typeInputDescriptionAndSubmitSaveButtonFail,
  typeInputDescriptionAndSubmitSaveButtonOk,
} from './category-helpers';

function captureLastCategory(): void {
  cy.getDataCy('categories-table-row')
    .last()
    .find('td')
    .first()
    .invoke('text')
    .then((text) => text.trim())
    .as('lastCategoryDescription');
}

function goToCategoriesListAndFilterCategoryDescriptionAndClickEditButton(
  type: CategoryType,
  validCategoryDescription: string,
): void {
  goToCategoryListAndFilterCategoryDescriptionAndClickButton(
    type,
    validCategoryDescription,
    'edit',
  );
}

function clickEditButtonInCategoriesTableRowAndCheckEditRoute(type: CategoryType) {
  clickEditButtonInTableRowAndCheckEditRoute('categories-table-row', categoryPath(type));
}

describe('Category Edit Page', { testIsolation: false }, () => {
  before(() => {
    maybeSetupApiMockAndLogin();
  });

  [CategoryType.CREDIT, CategoryType.DEBIT, CategoryType.EQUITY].forEach((type) => {
    describe(`Type - ${type}`, () => {
      beforeEach(() => {
        maybeSetupApiMockAndNatigateToCategoriesList(type);
      });

      it('clicking pencil on last category opens edit', () => {
        clickEditButtonInCategoriesTableRowAndCheckEditRoute(type);
      });

      it('go back to list using list icon', () => {
        clickEditButtonInCategoriesTableRowAndCheckEditRoute(type);
        clickListButtonAndVerifyListUrl(categoryPath(type));
      });

      it('navigation: clicking magnifying glass on last category goes to details', () => {
        cy.getDataCy('categories-table-row')
          .last()
          .within(() => {
            cy.getDataCy('detail-button').should('be.visible').click();
          });

        cy.url().should('include', detailPath(categoryPath(type)));
      });

      it('edit last category by adding _edited to the description', () => {
        captureLastCategory();

        cy.get<string>('@lastCategoryDescription').then((originalDescription) => {
          clickEditButtonInCategoriesTableRowAndCheckEditRoute(type);

          const newDescription = `${originalDescription}_edited`;

          typeInputDescriptionAndSubmitSaveButtonOk(type, newDescription, newDescription, true);
        });
      });

      describe('Validation Tests', () => {
        const validCategoryDescription = Cypress._.uniqueId('category_');

        beforeEach(() => {
          // Create an category first that will be edited in tests
          cy.navigateToCategoryNew(type);

          typeInputDescriptionAndSubmitSaveButtonOk(
            type,
            validCategoryDescription,
            validCategoryDescription,
          );

          goToCategoriesListAndFilterCategoryDescriptionAndClickEditButton(
            type,
            validCategoryDescription,
          );

          cy.url().should('include', editPath(categoryPath(type)));
        });

        function submitInvalidDescription(testCaseDescription: string): void {
          // eslint-disable-next-line security/detect-object-injection
          const testCase = stringBoundaryTestCases[testCaseDescription];

          typeInputDescriptionAndSubmitSaveButtonFail(testCase, true);

          cy.url().should('include', editPath(categoryPath(type)));
        }

        it('OW-01: should fail when trying to edit category with description containing only whitespace', () => {
          submitInvalidDescription('OW-01');
        });

        it('OW-02: should edit category successfully using 3 characters (lower limit)', () => {
          const valueToSubmit = Cypress._.uniqueId(stringBoundaryTestCases['OW-02'] + '_');
          typeInputDescriptionAndSubmitSaveButtonOk(type, valueToSubmit, valueToSubmit, true);
        });

        it('OW-03: should edit category successfully using 255 characters (upper limit)', () => {
          const valueToSubmit = Cypress._.uniqueId(
            stringBoundaryTestCases['OW-03'].substring(0, 245),
          );
          typeInputDescriptionAndSubmitSaveButtonOk(type, valueToSubmit, valueToSubmit, true);
        });

        // Reason: maxLength does not allow more than 255 characters to be typed in the input
        it('OW-04: should fail when trying to edit category with 256 characters (exceeds upper limit)', () => {
          const valueToSubmit = stringBoundaryTestCases['OW-04'];
          const savedValue = valueToSubmit.substring(0, 255); // maxLength should fix it to 255 characters
          typeInputDescriptionAndSubmitSaveButtonOk(type, valueToSubmit, savedValue, true);
        });

        it('OW-05: should fail when trying to edit category with existing description', () => {
          const duplicateDescription = Cypress._.uniqueId('dup_');

          // Create another category first
          cy.navigateToCategoryNew(type);
          typeInputDescriptionAndSubmitSaveButtonOk(
            type,
            duplicateDescription,
            duplicateDescription,
          );

          // Go back to edit the original category with duplicate description
          goToCategoriesListAndFilterCategoryDescriptionAndClickEditButton(
            type,
            validCategoryDescription,
          );
          typeInputDescriptionAndSubmitSaveButtonFail(duplicateDescription, true);

          cy.url().should('include', editPath(categoryPath(type)));
        });
      });
    });
  });
});
