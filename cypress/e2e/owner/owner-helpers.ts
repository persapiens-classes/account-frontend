import { PATHS } from '../../../src/app/app.paths';
import {
  clickButtonInFirstTableRow,
  submitSaveButtonFail,
  submitSaveButtonOk,
  typeInput,
} from '../cy-helpers';

export function typeInputNameAndSubmitSaveButtonOk(
  inputValue: string,
  savedValue: string,
  clearInputName = false,
) {
  typeInput('name', inputValue, clearInputName);
  submitSaveButtonOk(PATHS.OWNER_PATH, 'name', savedValue);
}

export function typeInputNameAndSubmitSaveButtonFail(
  inputValue: string,
  path: string,
  clearInputName = false,
) {
  typeInput('name', inputValue, clearInputName);
  submitSaveButtonFail(path);
}

export function goToOwnerListAndFilterOwnerNameAndClickButton(
  ownerName: string,
  action: string,
): void {
  // Go to owners list and open the edit page for the created owner
  cy.navigateToOwnerList();

  cy.getDataCy('filter-name-input').clear();
  cy.getDataCy('filter-name-input').type(`${ownerName}{enter}`);

  clickButtonInFirstTableRow('owners-table-row', ownerName, action);
}
