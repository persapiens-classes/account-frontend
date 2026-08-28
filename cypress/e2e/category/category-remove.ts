import { CategoryType } from '../../../src/app/category/category';
import { clickRemoveButtonAndConfirRemoval } from '../cy-helpers';
import {
  categoryPath,
  goToCategoryListAndFilterCategoryDescriptionAndClickButton,
  typeInputDescriptionAndSubmitSaveButtonOk,
} from './category-helpers';

describe('Category Remove Page', { testIsolation: false }, () => {
  [CategoryType.CREDIT, CategoryType.DEBIT, CategoryType.EQUITY].forEach((type) => {
    describe(`Type - ${type}`, () => {
      beforeEach(() => {
        cy.maybeSetupApiMock();
      });

      it('should remove the recently created Category successfully', () => {
        const validCategoryDescription = Cypress._.uniqueId('salary_'); // unique name

        cy.navigateToCategoryNew(type);

        // create validCategoryDescription to remove later
        typeInputDescriptionAndSubmitSaveButtonOk(
          type,
          validCategoryDescription,
          validCategoryDescription,
          false,
        );

        // select validCategoryDescription and click delete button
        goToCategoryListAndFilterCategoryDescriptionAndClickButton(
          type,
          validCategoryDescription,
          'delete',
        );

        clickRemoveButtonAndConfirRemoval('categories-table-row', categoryPath(type));
      });
    });
  });
});
