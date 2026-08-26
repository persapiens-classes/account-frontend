import { PATHS } from '../../../src/app/app.paths';
import {
  clickButtonInFirstTableRow,
  typeInputAndSubmitSaveButtonFail,
  typeInputAndSubmitSaveButtonOk,
} from '../cy-helpers';

export function typeInputNameAndSubmitSaveButtonOk(
  inputValue: string,
  savedValue: string,
  clearInputName = false,
) {
  typeInputAndSubmitSaveButtonOk(PATHS.OWNER_PATH, 'name', inputValue, savedValue, clearInputName);
}

export function typeInputNameAndSubmitSaveButtonFail(inputValue: string, clearInputName = false) {
  typeInputAndSubmitSaveButtonFail('name', inputValue, clearInputName);
}

export function goToOwnersListAndFilterOwnerNameAndClickButton(
  ownerName: string,
  action: string,
): void {
  // Go to owners list and open the edit page for the created owner
  cy.navigateToOwnersList();

  cy.getDataCy('filter-name-input').clear();
  cy.getDataCy('filter-name-input').type(`${ownerName}{enter}`);

  clickButtonInFirstTableRow('owners-table-row', ownerName, action);
}
