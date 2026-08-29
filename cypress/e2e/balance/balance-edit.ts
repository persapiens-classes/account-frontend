import { editPath, PATHS } from '../../../src/app/app.paths';
import { clickEditButtonInTableRowAndCheckEditRoute } from '../cy-helpers';
import {
  fillOwnerEquityAccountInitialValueFieldsAndSubmitSaveButtonOk,
  maybeSetupApiMockAndNatigateToBalanceList,
} from './balance-helpers';

function clickEditButtonInBalancesTableRowAndCheckEditRoute(index: number) {
  clickEditButtonInTableRowAndCheckEditRoute('balances-table-row', PATHS.BALANCE_PATH, index);
}

export function balanceEditTests() {
  describe('Balance Edit Page', { testIsolation: false }, () => {
    beforeEach(() => {
      maybeSetupApiMockAndNatigateToBalanceList();
    });

    it('clicking pencil on first balance opens edit', () => {
      clickEditButtonInBalancesTableRowAndCheckEditRoute(0);
      cy.url().should('include', editPath(PATHS.BALANCE_PATH));
    });

    it('edit last balance by adding _edited to the description', () => {
      cy.ownerEquityAccountInitialValuesDefault().then((models) => {
        const index = models.length - 1;
        clickEditButtonInBalancesTableRowAndCheckEditRoute(index);
        const validModel = models.at(index)!;

        validModel.initialValue = validModel.initialValue + 1;

        fillOwnerEquityAccountInitialValueFieldsAndSubmitSaveButtonOk(validModel, true, true);
      });
    });
  });
}
