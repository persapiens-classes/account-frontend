import { editPath, PATHS } from '../../../src/app/app.paths';
import { accessFirstTableDetail, clickListButtonAndVerifyListUrl } from '../cy-helpers';
import { maybeSetupApiMockAndNatigateToBalanceList } from './balance-helpers';

function accessBalanceDetail(): void {
  accessFirstTableDetail('balances-table', PATHS.BALANCE_PATH);
}

export function balanceDetailTests() {
  describe('Balance Detail Page', { testIsolation: false }, () => {
    beforeEach(() => {
      maybeSetupApiMockAndNatigateToBalanceList();
    });

    it('should access detail page when clicking magnifying glass', () => {
      accessBalanceDetail();
    });

    it('should go back to list when clicking list icon', () => {
      accessBalanceDetail();
      clickListButtonAndVerifyListUrl(PATHS.BALANCE_PATH);
    });

    it('should go to edit page when clicking pencil icon', () => {
      accessBalanceDetail();
      cy.getDataCy('edit-button').should('be.visible').click();
      cy.url().should('include', editPath(PATHS.BALANCE_PATH));
    });
  });
}
