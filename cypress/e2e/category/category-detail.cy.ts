import { editPath } from '../../../src/app/app.paths';
import { CategoryType } from '../../../src/app/category/category';
import {
  accessFirstTableDetail,
  clickListButtonAndVerifyListUrl,
  maybeSetupApiMockAndLogin,
} from '../cy-helpers';
import { categoryPath, maybeSetupApiMockAndNatigateToCategoriesList } from './category-helpers';

function accessCategoryDetail(type: CategoryType): void {
  accessFirstTableDetail('categories-table', categoryPath(type));
}

// jscpd:ignore-start
describe('Category Detail Page', { testIsolation: false }, () => {
  before(() => {
    maybeSetupApiMockAndLogin();
  });

  [CategoryType.CREDIT, CategoryType.DEBIT, CategoryType.EQUITY].forEach((type) => {
    describe(`Type - ${type}`, () => {
      beforeEach(() => {
        maybeSetupApiMockAndNatigateToCategoriesList(type);
      });
      //jscpd:ignore-end

      it('should access detail page when clicking magnifying glass', () => {
        accessCategoryDetail(type);
      });

      it('should go back to list when clicking list icon', () => {
        accessCategoryDetail(type);
        clickListButtonAndVerifyListUrl(categoryPath(type));
      });

      it('should go to edit page when clicking pencil icon', () => {
        accessCategoryDetail(type);
        cy.getDataCy('edit-button').should('be.visible').click();
        cy.url().should('include', editPath(categoryPath(type)));
      });
    });
  });
});
