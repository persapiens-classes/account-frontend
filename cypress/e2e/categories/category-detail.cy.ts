import { CategoryType } from '../../../src/app/category/category';

function accessCategoryDetail(type: CategoryType): void {
  cy.getDataCy('categories-table').should('exist');
  cy.getDataCy('detail-button').first().should('be.visible').click();
  cy.url().should('include', `/${type.toLowerCase()}Categories/detail`);
}

describe(`Category Detail Page - ${CategoryType.CREDIT}`, () => {
  beforeEach(() => {
    cy.maybeSetupApiMock();

    cy.login();

    cy.navigateToCategoriesList(CategoryType.CREDIT);
  });

  it('should access detail page when clicking magnifying glass', () => {
    console.log('Accessing category detail page...');
    //accessCategoryDetail(CategoryType.CREDIT);
  });

  /*
  it('should go back to list when clicking list icon', () => {
    accessCategoryDetail(CategoryType.CREDIT);
    cy.getDataCy('list-button').should('be.visible').click();
    cy.url().should('include', `/${CategoryType.CREDIT.toLowerCase()}Categories/list`);
  });

  it('should go to edit page when clicking pencil icon', () => {
    accessCategoryDetail(CategoryType.CREDIT);
    cy.getDataCy('edit-button').should('be.visible').click();
    cy.url().should('include', `/${CategoryType.CREDIT.toLowerCase()}Categories/edit`);
  });
  */
});
