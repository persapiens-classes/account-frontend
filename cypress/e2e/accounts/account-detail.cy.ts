import { detailPath, editPath } from '../../../src/app/app.paths';
import { AccountType } from '../../../src/app/account/account';
import { clickListButtonAndVerifyListUrl, maybeSetupApiMockAndLogin } from '../cy-helpers';
import { accountPath, maybeSetupApiMockAndNatigateToAccountsList } from './account-helpers';

function accessAccountDetail(type: AccountType): void {
  cy.getDataCy('accounts-table').should('exist');
  cy.getDataCy('detail-button').first().should('be.visible').click();
  cy.url().should('include', detailPath(accountPath(type)));
}

describe(
  `Account Detail Page - ${AccountType.CREDIT}`,
  { testIsolation: false },
  (type = AccountType.CREDIT) => {
    before(() => {
      maybeSetupApiMockAndLogin();
    });

    beforeEach(() => {
      maybeSetupApiMockAndNatigateToAccountsList(type);
    });

    it('should access detail page when clicking magnifying glass', () => {
      accessAccountDetail(type);
    });

    it('should go back to list when clicking list icon', () => {
      accessAccountDetail(type);
      clickListButtonAndVerifyListUrl(accountPath(type));
    });

    it('should go to edit page when clicking pencil icon', () => {
      accessAccountDetail(type);
      cy.getDataCy('edit-button').should('be.visible').click();
      cy.url().should('include', editPath(accountPath(type)));
    });
  },
);
