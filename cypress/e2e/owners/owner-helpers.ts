import { OwnersData } from './owner-fixture-models';

function typeInputNameAndSubmitSaveButton(testCaseName: string, clearInputName = false) {
  cy.getDataCy('input-name').should('be.visible');
  if (clearInputName) {
    cy.getDataCy('input-name').clear();
  }
  cy.getDataCy('input-name').type(testCaseName);
  cy.getDataCy('save-button').should('not.be.disabled').click();
}

export function typeInputNameAndSubmitSaveButtonOk(testCaseName: string, clearInputName = false) {
  typeInputNameAndSubmitSaveButton(testCaseName, clearInputName);

  cy.getDataCy('app-toast').should('be.visible');
  cy.url().should('include', '/owners/detail');
  cy.getDataCy('detail-name').should('have.text', testCaseName);
}

export function typeInputNameAndSubmitSaveButtonFail(testCaseName: string, clearInputName = false) {
  typeInputNameAndSubmitSaveButton(testCaseName, clearInputName);

  cy.getDataCy('app-toast').should('not.be.visible');
}

export function typeInputNameAndSubmitSaveButtonOkFn(
  testCaseNameFn: (ownersData: OwnersData) => string,
  clearInputName: boolean,
): void {
  cy.fixture('owners').then((ownersData) => {
    const testCaseName = testCaseNameFn(ownersData);

    typeInputNameAndSubmitSaveButtonOk(testCaseName, clearInputName);
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
