import { PATHS } from '../../../src/app/app.paths';
import { API_PATHS } from '../../../src/app/app.api-paths';
import { Entry, EntryType } from '../../../src/app/entry/entry';
import {
  clickButtonInFirstTableRow,
  clickSelectContains,
  submitSaveButtonFail,
  submitSaveButtonOk,
  typeDatePicker,
  typeInput,
  typeInputNumber,
} from '../cy-helpers';

export function entryPath(type: EntryType) {
  return `${type.toLowerCase()}${PATHS.ENTRY_PATH}`;
}

export function entryApiPath(type: EntryType) {
  return `${type.toLowerCase()}${API_PATHS.ENTRY_API_PATH}`;
}

export function maybeSetupApiMockAndNatigateToEntryList(type: EntryType) {
  cy.maybeSetupApiMock();
  cy.navigateToEntryList(type);
}

export function fillEntryFields(entry: Entry, clearInputName = false, skipInOwner = false) {
  typeDatePicker('date', entry.date, true);
  if (!skipInOwner) {
    clickSelectContains('in-owner', entry.inOwner);
  }
  clickSelectContains('in-account', entry.inAccount.description);
  clickSelectContains('out-owner', entry.outOwner);
  clickSelectContains('out-account', entry.outAccount.description);
  typeInputNumber('value', entry.value);
  typeInput('note', entry.note, clearInputName);
}

export function fillEntryFieldsAndSubmitSaveButtonOk(
  type: EntryType,
  entry: Entry,
  clearInputName = false,
) {
  fillEntryFields(entry, clearInputName, false);
  submitSaveButtonOk(entryPath(type), 'note', entry.note);
}

export function fillEntryFieldsAndSubmitSaveButtonFail(entry: Entry, clearInputName = false) {
  fillEntryFields(entry, clearInputName, true);
  submitSaveButtonFail();
}

export function goToEntryListAndFilterEntryDescriptionAndClickButton(
  type: EntryType,
  entryInOwner: string,
  action: string,
): void {
  // Go to entries list and open the edit page for the created entry
  cy.navigateToEntryList(type);

  cy.getDataCy('filter-inOwner-input').clear();
  cy.getDataCy('filter-inOwner-input').type(`${entryInOwner}{enter}`);

  clickButtonInFirstTableRow('entries-table-row', entryInOwner, action);
}
