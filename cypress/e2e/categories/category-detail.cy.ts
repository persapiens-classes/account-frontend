import { detailPath, editPath } from '../../../src/app/app.paths';
import { CategoryType } from '../../../src/app/category/category';
import { clickListButtonAndVerifyListUrl, maybeSetupApiMockAndLogin } from '../cy-helpers';
import { categoryPath, maybeSetupApiMockAndNatigateToCategoriesList } from './category-helpers';

function accessCategoryDetail(type: CategoryType): void {
  cy.getDataCy('categories-table').should('exist');
  cy.getDataCy('detail-button').first().should('be.visible').click();
  cy.url().should('include', detailPath(categoryPath(type)));
}

describe(
  `Category Detail Page - ${CategoryType.CREDIT}`,
  { testIsolation: false },
  (type = CategoryType.CREDIT) => {
    before(() => {
      maybeSetupApiMockAndLogin();
    });

    beforeEach(() => {
      maybeSetupApiMockAndNatigateToCategoriesList(type);
    });

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
  },
);
