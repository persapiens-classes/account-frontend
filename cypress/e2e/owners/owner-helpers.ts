import { OwnersData } from './owner-fixture-models';

export function typeInputNameAndSubmitButton(testCaseName: string) {
  cy.getDataCy('input-name').type(testCaseName);
  cy.getDataCy('save-button').should('not.be.disabled').click();
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

    typeInputNameAndSubmitButton(testCaseName);

    cy.getDataCy('app-toast').should('be.visible');
    cy.url().should('include', '/owners/detail');
  });
}
