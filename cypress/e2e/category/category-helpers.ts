import { PATHS } from '../../../src/app/app.paths';
import { API_PATHS } from '../../../src/app/app.api-paths';
import { CategoryType } from '../../../src/app/category/category';
import {
  clickButtonInFirstTableRow,
  submitSaveButtonFail,
  submitSaveButtonOk,
  typeInputDescription,
} from '../cy-helpers';

export function categoryPath(type: CategoryType) {
  return `${type.toLowerCase()}${PATHS.CATEGORY_PATH}`;
}

export function categoryApiPath(type: CategoryType) {
  return `${type.toLowerCase()}${API_PATHS.CATEGORY_API_PATH}`;
}

export function maybeSetupApiMockAndNatigateToCategoriesList(type: CategoryType) {
  cy.maybeSetupApiMock();
  cy.navigateToCategoryList(type);
}

export function typeInputDescriptionAndSubmitSaveButtonOk(
  type: CategoryType,
  inputValue: string,
  savedValue: string,
  clearInputName = false,
) {
  typeInputDescription(inputValue, clearInputName);
  submitSaveButtonOk(categoryPath(type), 'description', savedValue);
}

export function typeInputDescriptionAndSubmitSaveButtonFail(
  inputValue: string,
  path: string,
  clearInputName = false,
) {
  typeInputDescription(inputValue, clearInputName);
  submitSaveButtonFail(path);
}

export function goToCategoryListAndFilterCategoryDescriptionAndClickButton(
  type: CategoryType,
  categoryDescription: string,
  action: string,
): void {
  // Go to categories list and open the edit page for the created category
  cy.navigateToCategoryList(type);

  cy.getDataCy('filter-description-input').clear();
  cy.getDataCy('filter-description-input').type(`${categoryDescription}{enter}`);

  clickButtonInFirstTableRow('categories-table-row', categoryDescription, action);
}
