import { detailPath, editPath, listPath } from '../../../src/app/app.paths';
import { CategoryType } from '../../../src/app/category/category';
import { clickEditButtonInTableRowAndCheckEditRoute } from '../cy-helpers';
import { categoryDescriptionBoundaryTestCases } from './category-boundary-test-cases';
import {
  categoryPath,
  goToCategoriesListAndFilterCategoryDescriptionAndClickButton,
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
  goToCategoriesListAndFilterCategoryDescriptionAndClickButton(
    type,
    validCategoryDescription,
    'edit',
  );
}

describe('Category Edit Page', (type = CategoryType.CREDIT) => {
  beforeEach(() => {
    cy.maybeSetupApiMock();

    cy.login();

    cy.navigateToCategoriesList(type);
  });

  function clickEditButtonInCategoriesTableRowAndCheckEditRoute() {
    clickEditButtonInTableRowAndCheckEditRoute('categories-table-row', categoryPath(type));
  }

  it('clicking pencil on last category opens edit', () => {
    clickEditButtonInCategoriesTableRowAndCheckEditRoute();
  });

  it('go back to list using list icon', () => {
    clickEditButtonInCategoriesTableRowAndCheckEditRoute();

    cy.getDataCy('list-button').should('be.visible').click();
    cy.url().should('include', listPath(categoryPath(type)));
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
      clickEditButtonInCategoriesTableRowAndCheckEditRoute();

      const newDescription = `${originalDescription}_edited`;

      typeInputDescriptionAndSubmitSaveButtonOk(type, newDescription, newDescription, true);
    });
  });

  describe('Validation Tests', () => {
    const validCategoryDescription = Cypress._.uniqueId('category_');

    beforeEach(() => {
      // Create an category first that will be edited in tests
      cy.navigateToCategoriesNew(type);

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
      const testCase = categoryDescriptionBoundaryTestCases[testCaseDescription];

      typeInputDescriptionAndSubmitSaveButtonFail(testCase, true);

      cy.url().should('include', editPath(categoryPath(type)));
    }

    it('OW-01: should fail when trying to edit category with description containing only whitespace', () => {
      submitInvalidDescription('OW-01');
    });

    it('OW-02: should edit category successfully using 3 characters (lower limit)', () => {
      const valueToSubmit = Cypress._.uniqueId(categoryDescriptionBoundaryTestCases['OW-02'] + '_');
      typeInputDescriptionAndSubmitSaveButtonOk(type, valueToSubmit, valueToSubmit, true);
    });

    it('OW-03: should edit category successfully using 255 characters (upper limit)', () => {
      const valueToSubmit = Cypress._.uniqueId(
        categoryDescriptionBoundaryTestCases['OW-03'].substring(0, 245),
      );
      typeInputDescriptionAndSubmitSaveButtonOk(type, valueToSubmit, valueToSubmit, true);
    });

    // Reason: maxLength does not allow more than 255 characters to be typed in the input
    it('OW-04: should fail when trying to edit category with 256 characters (exceeds upper limit)', () => {
      const valueToSubmit = categoryDescriptionBoundaryTestCases['OW-04'];
      const savedValue = valueToSubmit.substring(0, 255); // maxLength should fix it to 255 characters
      typeInputDescriptionAndSubmitSaveButtonOk(type, valueToSubmit, savedValue, true);
    });

    it('OW-05: should fail when trying to edit category with existing description', () => {
      const duplicateDescription = Cypress._.uniqueId('dup_');

      // Create another category first
      cy.navigateToCategoriesNew(type);
      typeInputDescriptionAndSubmitSaveButtonOk(type, duplicateDescription, duplicateDescription);

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
