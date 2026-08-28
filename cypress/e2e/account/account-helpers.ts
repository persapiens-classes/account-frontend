import { PATHS } from '../../../src/app/app.paths';
import { API_PATHS } from '../../../src/app/app.api-paths';
import { AccountType } from '../../../src/app/account/account';
import {
  clickButtonInFirstTableRow,
  clickSelectEq,
  submitSaveButtonFail,
  submitSaveButtonOk,
  typeInput,
} from '../cy-helpers';

export function accountPath(type: AccountType) {
  return `${type.toLowerCase()}${PATHS.ACCOUNT_PATH}`;
}

export function accountApiPath(type: AccountType) {
  return `${type.toLowerCase()}${API_PATHS.ACCOUNT_API_PATH}`;
}

export function maybeSetupApiMockAndNatigateToAccountsList(type: AccountType) {
  cy.maybeSetupApiMock();
  cy.navigateToAccountList(type);
}

export function typeDescriptionSelectCategoryAndSubmitSaveButtonOk(
  type: AccountType,
  inputDescription: string,
  selectCategory: number,
  savedValue: string,
  clearInputName = false,
) {
  typeInput('description', inputDescription, clearInputName);
  clickSelectEq('category', selectCategory);
  submitSaveButtonOk(accountPath(type), 'description', savedValue);
}

export function typeDescriptionSelectCategoryAndSubmitSaveButtonFail(
  inputDescription: string,
  selectCategory: number,
  path: string,
  clearInputName = false,
) {
  typeInput('description', inputDescription, clearInputName);
  clickSelectEq('category', selectCategory);
  submitSaveButtonFail(path);
}

export function goToAccountListAndFilterAccountDescriptionAndClickButton(
  type: AccountType,
  accountDescription: string,
  action: string,
): void {
  // Go to account list and open the edit page for the created account
  cy.navigateToAccountList(type);

  cy.getDataCy('filter-description-input').clear();
  cy.getDataCy('filter-description-input').type(`${accountDescription}{enter}`);

  clickButtonInFirstTableRow('accounts-table-row', accountDescription, action);
}
