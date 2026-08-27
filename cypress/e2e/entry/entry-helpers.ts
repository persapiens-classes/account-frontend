import { PATHS } from '../../../src/app/app.paths';
import { API_PATHS } from '../../../src/app/app.api-paths';
import { EntryType } from '../../../src/app/entry/entry';
import {
  clickButtonInFirstTableRow,
  clickSelectEq,
  submitSaveButtonFail,
  submitSaveButtonOk,
  typeInput,
} from '../cy-helpers';

export function entryPath(type: EntryType) {
  return `${type.toLowerCase()}${PATHS.ENTRY_PATH}`;
}

export function entryApiPath(type: EntryType) {
  return `${type.toLowerCase()}${API_PATHS.ENTRY_API_PATH}`;
}

export function maybeSetupApiMockAndNatigateToEntriesList(type: EntryType) {
  cy.maybeSetupApiMock();
  cy.navigateToEntryList(type);
}

export function typeDescriptionSelectCategoryAndSubmitSaveButtonOk(
  type: EntryType,
  inputDescription: string,
  selectCategory: number,
  savedValue: string,
  clearInputName = false,
) {
  typeInput('description', inputDescription, clearInputName);
  clickSelectEq('category', selectCategory);
  submitSaveButtonOk(entryPath(type), 'description', savedValue);
}

export function typeDescriptionSelectCategoryAndSubmitSaveButtonFail(
  inputDescription: string,
  selectCategory: number,
  clearInputName = false,
) {
  typeInput('description', inputDescription, clearInputName);
  clickSelectEq('category', selectCategory);
  submitSaveButtonFail();
}

export function goToEntriesListAndFilterEntryDescriptionAndClickButton(
  type: EntryType,
  entryDescription: string,
  action: string,
): void {
  // Go to entries list and open the edit page for the created entry
  cy.navigateToEntryList(type);

  cy.getDataCy('filter-description-input').clear();
  cy.getDataCy('filter-description-input').type(`${entryDescription}{enter}`);

  clickButtonInFirstTableRow('entries-table-row', entryDescription, action);
}
