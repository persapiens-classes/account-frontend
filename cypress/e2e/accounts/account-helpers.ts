import { PATHS } from '../../../src/app/app.paths';
import { API_PATHS } from '../../../src/app/app.api-paths';
import { AccountType } from '../../../src/app/account/account';

export function accountPath(type: AccountType) {
  return `${type.toLowerCase()}${PATHS.ACCOUNT_PATH}`;
}

export function accountApiPath(type: AccountType) {
  return `${type.toLowerCase()}${API_PATHS.ACCOUNT_API_PATH}`;
}

export function maybeSetupApiMockAndNatigateToAccountsList(type: AccountType) {
  cy.maybeSetupApiMock();
  cy.navigateToAccountsList(type);
}
