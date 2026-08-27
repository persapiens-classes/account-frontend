import { PATHS } from '../../../src/app/app.paths';
import { API_PATHS } from '../../../src/app/app.api-paths';
import { Entry, EntryType } from '../../../src/app/entry/entry';
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

export function fillEntryFields(entry: Entry, clearInputName = false) {
  typeInput('date', entry.date, clearInputName);
  clickSelectEq('in-owner', entry.inOwner);
  clickSelectEq('in-account', entry.inAccount.description);
  clickSelectEq('out-owner', entry.outOwner);
  clickSelectEq('out-account', entry.outAccount.description);
  typeInput('value', entry.value.toString(), clearInputName);
  typeInput('note', entry.note, clearInputName);
}

export function fillEntryFieldsAndSubmitSaveButtonOk(
  type: EntryType,
  entry: Entry,
  savedNote: string,
  clearInputName = false,
) {
  fillEntryFields(entry, clearInputName);
  submitSaveButtonOk(entryPath(type), 'note', savedNote);
}

export function fillEntryFieldsAndSubmitSaveButtonFail(entry: Entry, clearInputName = false) {
  fillEntryFields(entry, clearInputName);
  submitSaveButtonFail();
}

export function goToEntryListAndFilterEntryDescriptionAndClickButton(
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
