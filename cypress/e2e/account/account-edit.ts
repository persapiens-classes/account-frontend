import { detailPath, editPath } from '../../../src/app/app.paths';
import { AccountType } from '../../../src/app/account/account';
import {
  clickEditButtonInTableRowAndCheckEditRoute,
  clickListButtonAndVerifyListUrl,
  stringBoundaryTestCases,
} from '../cy-helpers';
import {
  accountPath,
  goToAccountListAndFilterAccountDescriptionAndClickButton,
  maybeSetupApiMockAndNatigateToAccountsList,
  typeDescriptionSelectCategoryAndSubmitSaveButtonFail,
  typeDescriptionSelectCategoryAndSubmitSaveButtonOk,
} from './account-helpers';

function captureLastAccount(): void {
  cy.getDataCy('accounts-table-row')
    .last()
    .find('td')
    .first()
    .invoke('text')
    .then((text) => text.trim())
    .as('lastAccountDescription');
}

function goToAccountsListAndFilterAccountDescriptionAndClickEditButton(
  type: AccountType,
  validAccountDescription: string,
): void {
  goToAccountListAndFilterAccountDescriptionAndClickButton(type, validAccountDescription, 'edit');
}

function clickEditButtonInAccountsTableRowAndCheckEditRoute(type: AccountType) {
  clickEditButtonInTableRowAndCheckEditRoute('accounts-table-row', accountPath(type));
}

describe('Account Edit Page', { testIsolation: false }, () => {
  [AccountType.CREDIT, AccountType.DEBIT, AccountType.EQUITY].forEach((type) => {
    describe(`Type - ${type}`, () => {
      beforeEach(() => {
        maybeSetupApiMockAndNatigateToAccountsList(type);
      });

      it('clicking pencil on last account opens edit', () => {
        clickEditButtonInAccountsTableRowAndCheckEditRoute(type);
      });

      it('go back to list using list icon', () => {
        clickEditButtonInAccountsTableRowAndCheckEditRoute(type);
        clickListButtonAndVerifyListUrl(accountPath(type));
      });

      it('navigation: clicking magnifying glass on last account goes to details', () => {
        cy.getDataCy('accounts-table-row')
          .last()
          .within(() => {
            cy.getDataCy('detail-button').should('be.visible').click();
          });

        cy.url().should('include', detailPath(accountPath(type)));
      });

      it('edit last account by adding _edited to the description', () => {
        captureLastAccount();

        cy.get<string>('@lastAccountDescription').then((originalDescription) => {
          clickEditButtonInAccountsTableRowAndCheckEditRoute(type);

          const newDescription = `${originalDescription}_edited`;

          typeDescriptionSelectCategoryAndSubmitSaveButtonOk(
            type,
            newDescription,
            0,
            newDescription,
            true,
          );
        });
      });

      describe('Validation Tests', () => {
        const validAccountDescription = Cypress._.uniqueId('account_');

        beforeEach(() => {
          // Create an account first that will be edited in tests
          cy.navigateToAccountNew(type);

          typeDescriptionSelectCategoryAndSubmitSaveButtonOk(
            type,
            validAccountDescription,
            0,
            validAccountDescription,
          );

          goToAccountsListAndFilterAccountDescriptionAndClickEditButton(
            type,
            validAccountDescription,
          );

          cy.url().should('include', editPath(accountPath(type)));
        });

        function submitInvalidDescription(testCaseDescription: string): void {
          // eslint-disable-next-line security/detect-object-injection
          const testCase = stringBoundaryTestCases[testCaseDescription];

          typeDescriptionSelectCategoryAndSubmitSaveButtonFail(testCase, 0, true);

          cy.url().should('include', editPath(accountPath(type)));
        }

        it('OW-01: should fail when trying to edit account with description containing only whitespace', () => {
          submitInvalidDescription('OW-01');
        });

        it('OW-02: should edit account successfully using 3 characters (lower limit)', () => {
          const valueToSubmit = Cypress._.uniqueId(stringBoundaryTestCases['OW-02'] + '_');
          typeDescriptionSelectCategoryAndSubmitSaveButtonOk(
            type,
            valueToSubmit,
            0,
            valueToSubmit,
            true,
          );
        });

        it('OW-03: should edit account successfully using 255 characters (upper limit)', () => {
          const valueToSubmit = Cypress._.uniqueId(
            stringBoundaryTestCases['OW-03'].substring(0, 245),
          );
          typeDescriptionSelectCategoryAndSubmitSaveButtonOk(
            type,
            valueToSubmit,
            0,
            valueToSubmit,
            true,
          );
        });

        // Reason: maxLength does not allow more than 255 characters to be typed in the input
        it('OW-04: should fail when trying to edit account with 256 characters (exceeds upper limit)', () => {
          const valueToSubmit = stringBoundaryTestCases['OW-04'];
          const savedValue = valueToSubmit.substring(0, 255); // maxLength should fix it to 255 characters
          typeDescriptionSelectCategoryAndSubmitSaveButtonOk(
            type,
            valueToSubmit,
            0,
            savedValue,
            true,
          );
        });

        it('OW-05: should fail when trying to edit account with existing description', () => {
          const duplicateDescription = Cypress._.uniqueId('dup_');

          // Create another account first
          cy.navigateToAccountNew(type);
          typeDescriptionSelectCategoryAndSubmitSaveButtonOk(
            type,
            duplicateDescription,
            0,
            duplicateDescription,
          );

          // Go back to edit the original account with duplicate description
          goToAccountsListAndFilterAccountDescriptionAndClickEditButton(
            type,
            validAccountDescription,
          );
          typeDescriptionSelectCategoryAndSubmitSaveButtonFail(duplicateDescription, 0, true);

          cy.url().should('include', editPath(accountPath(type)));
        });
      });
    });
  });
});
