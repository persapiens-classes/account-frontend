import { detailPath, editPath, listPath } from '../../src/app/app.paths';

export function maybeSetupApiMockAndLogin() {
  cy.maybeSetupApiMock();
  cy.login();
}

function typeInputAndSubmitSaveButton(
  inputName: string,
  inputValue: string,
  clearInputName = false,
) {
  cy.getDataCy(`input-${inputName}`).should('be.visible');
  if (clearInputName) {
    cy.getDataCy(`input-${inputName}`).clear();
  }
  cy.getDataCy(`input-${inputName}`).type(inputValue);
  cy.getDataCy('save-button').should('not.be.disabled').click();
}

export function typeInputAndSubmitSaveButtonOk(
  path: string,
  inputName: string,
  inputValue: string,
  savedValue: string,
  clearInputName = false,
) {
  typeInputAndSubmitSaveButton(inputName, inputValue, clearInputName);

  cy.getDataCy('app-toast').should('be.visible');
  cy.url().should('include', detailPath(path));
  cy.getDataCy(`detail-${inputName}`).should('have.text', savedValue);
}

export function typeInputAndSubmitSaveButtonFail(
  inputName: string,
  inputValue: string,
  clearInputName = false,
) {
  typeInputAndSubmitSaveButton(inputName, inputValue, clearInputName);

  cy.getDataCy('app-toast').should('not.be.visible');
}

export function clickButtonInFirstTableRow(tableRow: string, value: string, action: string): void {
  cy.getDataCy(tableRow)
    .first()
    .within(() => {
      cy.contains('td', value).should('be.visible');
      cy.getDataCy(`${action}-button`).should('be.visible').click();
    });
}

export function clickRemoveButtonAndConfirRemoval(tableRow: string, path: string) {
  // Click accept button on the dialog to confirm removal
  cy.getDataCy('remove-confirm-dialog-accept-btn').click();

  // Confirm that the success message appears
  cy.getDataCy('app-toast').should('be.visible');

  // Confirm removal
  cy.url().should('include', listPath(path));
  cy.getDataCy(tableRow).should('not.exist');
}

export function clickEditButtonInTableRowAndCheckEditRoute(tableRow: string, path: string): void {
  cy.getDataCy(tableRow)
    .last()
    .within(() => {
      cy.getDataCy('edit-button').should('be.visible').click();
    });

  cy.url().should('include', editPath(path));
}
