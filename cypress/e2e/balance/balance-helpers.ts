import { PATHS } from '../../../src/app/app.paths';
import { OwnerEquityAccountInitialValue } from '../../../src/app/balance/owner-equity-account-initial-value';
import {
  clickButtonInFirstTableRow,
  clickSelectContains,
  submitSaveButtonFail,
  submitSaveButtonOk,
  typeInputNumber,
} from '../cy-helpers';

export function maybeSetupApiMockAndNatigateToBalanceList() {
  cy.maybeSetupApiMock();
  cy.navigateToBalanceList();
}

export function fillEntryFields(entry: OwnerEquityAccountInitialValue, skipOwner = false) {
  if (!skipOwner) {
    clickSelectContains('owner', entry.owner);
  }
  clickSelectContains('equity-account', entry.equityAccount.description);
  typeInputNumber('initial-value', entry.initialValue);
}

export function fillOwnerEquityAccountInitialValueFieldsAndSubmitSaveButtonOk(
  model: OwnerEquityAccountInitialValue,
  clearInputName = false,
) {
  fillEntryFields(model, clearInputName);
  submitSaveButtonOk(PATHS.BALANCE_PATH, 'owner', model.owner);
}

export function fillOwnerEquityAccountInitialValueFieldsAndSubmitSaveButtonFail(
  model: OwnerEquityAccountInitialValue,
  path: string,
  skipOwner = false,
) {
  fillEntryFields(model, skipOwner);
  submitSaveButtonFail(path);
}

export function goToBalanceListAndFilterBalanceInOwnerAndClickButton(
  balanceOwner: string,
  action: string,
): void {
  cy.navigateToBalanceList();

  cy.getDataCy('filter-owner-input').clear();
  cy.getDataCy('filter-owner-input').type(`${balanceOwner}{enter}`);

  clickButtonInFirstTableRow('balances-table-row', balanceOwner, action);
}
