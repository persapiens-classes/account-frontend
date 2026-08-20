import { OwnersData } from './owner-fixture-models';

function typeInputNameAndSubmitButton(testCaseName: string) {
  cy.getDataCy('input-name').type(testCaseName);
  cy.getDataCy('save-button').should('not.be.disabled').click();
}

export function typeInputNameAndSubmitButtonOk(testCaseName: string) {
  typeInputNameAndSubmitButton(testCaseName);

  cy.getDataCy('app-toast').should('be.visible');
  cy.url().should('include', '/owners/detail');
}

export function typeInputNameAndSubmitButtonFail(testCaseName: string) {
  typeInputNameAndSubmitButton(testCaseName);

  cy.getDataCy('app-toast').should('not.be.visible');
}

export function submitOwnerNameAndVerifyDetailRoute(
  testCaseNameFn: (ownersData: OwnersData) => string,
  clearInputName: boolean,
): void {
  cy.fixture('owners').then((ownersData) => {
    const testCaseName = testCaseNameFn(ownersData);

    if (clearInputName) {
      cy.getDataCy('input-name').clear();
    }

    typeInputNameAndSubmitButtonOk(testCaseName);

    cy.url().should('include', '/owners/detail');
  });
}

export function goToOwnersListAndFilterOwnerNameAndClickButton(
  ownerName: string,
  action: string,
): void {
  // Go to owners list and open the edit page for the created owner
  cy.navigateToOwnersList();

  cy.getDataCy('filter-name-input').clear();
  cy.getDataCy('filter-name-input').type(`${ownerName}{enter}`);

  cy.getDataCy('owners-table-row')
    .first()
    .within(() => {
      cy.contains('td', ownerName).should('be.visible');
      cy.getDataCy(`${action}-button`).should('be.visible').click();
    });
}
