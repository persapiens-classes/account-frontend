import { editPath } from '../../../src/app/app.paths';
import { AccountType } from '../../../src/app/account/account';
import { accessFirstTableDetail, clickListButtonAndVerifyListUrl } from '../cy-helpers';
import { accountPath, maybeSetupApiMockAndNatigateToAccountsList } from './account-helpers';

function accessAccountDetail(type: AccountType): void {
  accessFirstTableDetail('accounts-table', accountPath(type));
}

export function accountDetailTests() {
  // jscpd:ignore-start
  describe('Account Detail Page', { testIsolation: false }, () => {
    [AccountType.CREDIT, AccountType.DEBIT, AccountType.EQUITY].forEach((type) => {
      describe(`Type - ${type}`, () => {
        beforeEach(() => {
          maybeSetupApiMockAndNatigateToAccountsList(type);
        });
        //jscpd:ignore-end

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
      });
    });
  });
}
