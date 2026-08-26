import { editPath, listPath } from '../../../src/app/app.paths';
import { CategoryType } from '../../../src/app/category/category';
import { categoryPath } from './category-helpers';

function accessCategoryDetail(type: CategoryType): void {
  cy.getDataCy('categories-table').should('exist');
  cy.getDataCy('detail-button').first().should('be.visible').click();
  cy.url().should('include', `/${type.toLowerCase()}Categories/detail`);
}

describe(`Category Detail Page - ${CategoryType.CREDIT}`, (type = CategoryType.CREDIT) => {
  beforeEach(() => {
    cy.maybeSetupApiMock();

    cy.login();

    cy.navigateToCategoriesList(type);
  });

  it('should access detail page when clicking magnifying glass', () => {
    console.log('Accessing category detail page...');
    accessCategoryDetail(type);
  });

  it('should go back to list when clicking list icon', () => {
    accessCategoryDetail(type);
    cy.getDataCy('list-button').should('be.visible').click();
    cy.url().should('include', listPath(categoryPath(type)));
  });

  it('should go to edit page when clicking pencil icon', () => {
    accessCategoryDetail(type);
    cy.getDataCy('edit-button').should('be.visible').click();
    cy.url().should('include', editPath(categoryPath(type)));
  });
});
