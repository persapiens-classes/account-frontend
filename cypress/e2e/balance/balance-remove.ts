import { PATHS } from '../../../src/app/app.paths';
import { clickRemoveButtonAndConfirRemoval as clickRemoveButtonAndConfirmRemoval } from '../cy-helpers';
import { goToBalanceListAndFilterBalanceInOwnerAndClickButton } from './balance-helpers';

export function balanceRemoveTests() {
  describe('Balance Remove Page', { testIsolation: false }, () => {
    beforeEach(() => {
      cy.maybeSetupApiMock();
    });

    it('should remove the recently created Balance successfully', () => {
      cy.balancesDefault().then((balances) => {
        const validBalance = balances.at(0)!;

        // select validBalance and click delete button
        goToBalanceListAndFilterBalanceInOwnerAndClickButton(validBalance.owner, 'delete');

        clickRemoveButtonAndConfirmRemoval('balances-table-row', PATHS.BALANCE_PATH);
      });
    });
  });
}
