import { CategoryType } from '../../../src/app/category/category';
import { clickRemoveButtonAndConfirRemoval } from '../cy-helpers';
import {
  categoryPath,
  goToCategoriesListAndFilterCategoryDescriptionAndClickButton,
  typeInputDescriptionAndSubmitSaveButtonOk,
} from './category-helpers';

describe('Category Remove Page', () => {
  beforeEach(() => {
    cy.maybeSetupApiMock();

    cy.login();
  });

  it('should remove the recently created Category successfully', () => {
    const validCategoryDescription = Cypress._.uniqueId('salary_'); // unique name

    const type = CategoryType.CREDIT;

    cy.navigateToCategoriesNew(type);

    // create validCategoryDescription to remove later
    typeInputDescriptionAndSubmitSaveButtonOk(
      type,
      validCategoryDescription,
      validCategoryDescription,
      false,
    );

    // select validCategoryDescription and click delete button
    goToCategoriesListAndFilterCategoryDescriptionAndClickButton(
      type,
      validCategoryDescription,
      'delete',
    );

    clickRemoveButtonAndConfirRemoval('categories-table-row', categoryPath(type));
  });
});
