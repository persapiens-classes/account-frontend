import { listPath, newPath, PATHS } from '../../../src/app/app.paths';
import {
  fillOwnerEquityAccountInitialValueFieldsAndSubmitSaveButtonOk,
  fillOwnerEquityAccountInitialValueFieldsAndSubmitSaveButtonFail,
} from './balance-helpers';

export function balanceInsertTests() {
  describe('Balance Insert Page', { testIsolation: false }, () => {
    beforeEach(() => {
      cy.maybeSetupApiMock();
      cy.navigateToBalanceNew();
    });

    it('should allow going back to the list', () => {
      cy.getDataCy('list-button').should('be.visible').click();
      cy.url().should('include', listPath(PATHS.BALANCE_PATH));
    });

    it('should create a new Balance successfully', () => {
      cy.ownerEquityAccountInitialValuesDefault().then((models) => {
        const validModel = models.at(0)!;
        cy.ownersDefault().then((owners) => {
          validModel.owner = owners.at(2)!.name;
          validModel.initialValue = validModel.initialValue - 1;

          fillOwnerEquityAccountInitialValueFieldsAndSubmitSaveButtonOk(validModel, false);
        });
      });
    });

    describe('Validation Tests', () => {
      it('OW-01: should fail when not selecting an owner', () => {
        cy.ownerEquityAccountInitialValuesDefault().then((models) => {
          const validModel = models.at(0)!;
          fillOwnerEquityAccountInitialValueFieldsAndSubmitSaveButtonFail(
            validModel,
            newPath(PATHS.BALANCE_PATH),
            true,
          );
        });
      });
    });
  });
}
