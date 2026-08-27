import { AccountType } from '../../../src/app/account/account';
import { clickRemoveButtonAndConfirRemoval, maybeSetupApiMockAndLogin } from '../cy-helpers';
import {
  accountPath,
  goToAccountsListAndFilterAccountDescriptionAndClickButton,
  typeDescriptionSelectCategoryAndSubmitSaveButtonOk,
} from './account-helpers';

describe('Account Remove Page', { testIsolation: false }, () => {
  before(() => {
    maybeSetupApiMockAndLogin();
  });

  [AccountType.CREDIT, AccountType.DEBIT, AccountType.EQUITY].forEach((type) => {
    describe(`Type - ${type}`, () => {
      beforeEach(() => {
        cy.maybeSetupApiMock();
      });

      it('should remove the recently created Account successfully', () => {
        const validAccountDescription = Cypress._.uniqueId('salary_'); // unique name

        cy.navigateToAccountNew(type);

        // create validAccountDescription to remove later
        typeDescriptionSelectCategoryAndSubmitSaveButtonOk(
          type,
          validAccountDescription,
          0,
          validAccountDescription,
          false,
        );

        // select validAccountDescription and click delete button
        goToAccountsListAndFilterAccountDescriptionAndClickButton(
          type,
          validAccountDescription,
          'delete',
        );

        clickRemoveButtonAndConfirRemoval('accounts-table-row', accountPath(type));
      });
    });
  });
});
