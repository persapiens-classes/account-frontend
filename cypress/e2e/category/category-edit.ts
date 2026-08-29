import { detailPath, editPath } from '../../../src/app/app.paths';
import { CategoryType } from '../../../src/app/category/category';
import { MAX_LENGTH } from '../../../src/app/models/models';
import {
  clickEditButtonInTableRowAndCheckEditRoute,
  clickListButtonAndVerifyListUrl,
  stringBoundaryTestCases,
} from '../cy-helpers';
import {
  categoryPath,
  goToCategoryListAndFilterCategoryDescriptionAndClickButton,
  maybeSetupApiMockAndNatigateToCategoriesList,
  typeInputDescriptionAndSubmitSaveButtonFail,
  typeInputDescriptionAndSubmitSaveButtonOk,
} from './category-helpers';

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

function clickEditButtonInCategoriesTableRowAndCheckEditRoute(type: CategoryType, index: number) {
  clickEditButtonInTableRowAndCheckEditRoute('categories-table-row', categoryPath(type), index);
}

export function categoryEditTests(): void {
  describe('Category Edit Page', { testIsolation: false }, () => {
    [CategoryType.CREDIT, CategoryType.DEBIT, CategoryType.EQUITY].forEach((type) => {
      describe(`Type - ${type}`, () => {
        beforeEach(() => {
          maybeSetupApiMockAndNatigateToCategoriesList(type);
        });

        it('clicking pencil on first category opens edit', () => {
          clickEditButtonInCategoriesTableRowAndCheckEditRoute(type, 0);
        });

        it('go back to list using list icon', () => {
          clickEditButtonInCategoriesTableRowAndCheckEditRoute(type, 0);
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

        it('edit second category by adding _edited to the description', () => {
          cy.categoriesDefault(type).then((categories) => {
            const index = 1;
            clickEditButtonInCategoriesTableRowAndCheckEditRoute(type, index);

            const newDescription = `${categories.at(index)!.description}_edited`;

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

          it('OW-01: should fail when trying to edit category with description containing only whitespace', () => {
            const testCase = stringBoundaryTestCases['OW-01'];

            typeInputDescriptionAndSubmitSaveButtonFail(
              testCase,
              editPath(categoryPath(type)),
              true,
            );
          });

          it('OW-02: should edit category successfully using 3 characters (lower limit)', () => {
            const valueToSubmit = Cypress._.uniqueId(stringBoundaryTestCases['OW-02'] + '_');
            typeInputDescriptionAndSubmitSaveButtonOk(type, valueToSubmit, valueToSubmit, true);
          });

          it(`OW-03: should edit category successfully using ${MAX_LENGTH} characters (upper limit)`, () => {
            const valueToSubmit = Cypress._.uniqueId(
              stringBoundaryTestCases['OW-03'].substring(0, MAX_LENGTH - 10),
            );
            typeInputDescriptionAndSubmitSaveButtonOk(type, valueToSubmit, valueToSubmit, true);
          });

          // Reason: maxLength does not allow more than MAX_LENGTH characters to be typed in the input
          it(`OW-04: should fail when trying to edit category with ${MAX_LENGTH + 1} characters (exceeds upper limit)`, () => {
            const valueToSubmit = stringBoundaryTestCases['OW-04'];
            const savedValue = valueToSubmit.substring(0, MAX_LENGTH); // maxLength should fix it to MAX_LENGTH characters
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
            typeInputDescriptionAndSubmitSaveButtonFail(
              duplicateDescription,
              editPath(categoryPath(type)),
              true,
            );
          });
        });
      });
    });
  });
}
