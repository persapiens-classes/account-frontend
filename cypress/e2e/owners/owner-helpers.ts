import { OwnersData } from './owner-fixture-models';

export function typeInputNameAndSubmitButton(testCaseName: string) {
  cy.get('[data-cy="input-name"]').type(testCaseName);
  cy.get('[data-cy="save-button"]').should('not.be.disabled').click();
}

export function submitOwnerNameAndVerifyDetailRoute(
  testCaseNameFn: (ownersData: OwnersData) => string,
  clearInputName: boolean,
): void {
  cy.fixture('owners').then((ownersData) => {
    const testCaseName = testCaseNameFn(ownersData);

    if (clearInputName) {
      cy.get('[data-cy="input-name"]').clear();
    }

    typeInputNameAndSubmitButton(testCaseName);

    cy.get('[data-cy="app-toast"]').should('be.visible');
    cy.url().should('include', '/owners/detail');
  });
}
