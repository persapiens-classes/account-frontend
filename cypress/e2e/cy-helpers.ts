import { detailPath, editPath, listPath } from '../../src/app/app.paths';

export type StringBoundaryTestCase = Record<string, string>;

export const stringBoundaryTestCases: StringBoundaryTestCase = {
  'OW-01': '   ', // Only whitespace
  'OW-02': 'abc', // 3 characters (lower limit)
  'OW-03': 'a'.repeat(255), // 255 characters (upper limit)
  'OW-04': 'a'.repeat(256), // 256 characters (exceeds upper limit)
};

export function maybeSetupApiMockAndLogin() {
  cy.maybeSetupApiMock();
  cy.login();
}

export function typeInput(inputName: string, inputValue: string, clearInputName = false) {
  cy.getDataCy(`input-${inputName}`).should('be.visible');
  if (clearInputName) {
    cy.getDataCy(`input-${inputName}`).clear();
  }
  cy.getDataCy(`input-${inputName}`).type(inputValue);
}

export function typeInputNumber(inputName: string, inputValue: number, clearInputName = false) {
  const valueToType = String(inputValue);
  cy.getDataCy(`input-${inputName}`)
    .should('be.visible')
    .then(($input) => {
      if (clearInputName) {
        cy.wrap($input).type('{selectall}{backspace}');
      }
      cy.wrap($input).type(valueToType);
    });
}
export function typeDatePicker(inputName: string, inputValue: Date, clearInputName = false) {
  // Converte objeto Date em string no formato dd/mm/yyyy (pt-BR)
  const formattedValue =
    inputValue instanceof Date
      ? inputValue.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      : inputValue;

  cy.getDataCy(`input-${inputName}`)
    .should('be.visible')
    .find('input')
    .then(($input) => {
      if (clearInputName) {
        cy.wrap($input).type('{selectall}{backspace}');
      }

      // Digita a data formatada e envia {enter} para confirmar e fechar o overlay
      cy.wrap($input).type(`${formattedValue}{enter}`);
    });
}
export function clickSelect(selectName: string) {
  cy.getDataCy(`select-${selectName}`).should('be.visible');
  cy.getDataCy(`select-${selectName}`).click();
}

export function clickSelectEq(selectName: string, selectIndex: number) {
  clickSelect(selectName);
  cy.get('[role="option"]:visible').eq(selectIndex).click();
}

export function clickSelectContains(selectName: string, selectText: string) {
  clickSelect(selectName);
  cy.get('[role="option"]:visible').contains(selectText).click();
}

export function typeInputDescription(inputValue: string, clearInputName = false) {
  typeInput('description', inputValue, clearInputName);
}

function submitSaveButton() {
  cy.getDataCy('save-button').should('not.be.disabled').click();
}

export function submitSaveButtonOk(path: string, inputName: string, savedValue: string) {
  submitSaveButton();
  cy.getDataCy('app-toast').should('be.visible');
  cy.url().should('include', detailPath(path));
  cy.getDataCy(`detail-${inputName}`).should('have.text', savedValue);
}

export function submitSaveButtonFail() {
  submitSaveButton();
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

export function clickListButtonAndVerifyListUrl(path: string): void {
  cy.getDataCy('list-button').should('be.visible').click();
  cy.url().should('include', listPath(path));
}

export function accessFirstTableDetail(table: string, path: string): void {
  cy.getDataCy(table).should('exist');
  cy.getDataCy('detail-button').first().should('be.visible').click();
  cy.url().should('include', detailPath(path));
}
