import {
  goToOwnersListAndFilterOwnerNameAndClickButton,
  typeInputNameAndSubmitSaveButtonOkFn,
} from './owner-helpers';

describe('Owner Remove Page', () => {
  const validOwnerName = Cypress._.uniqueId('fabiana_'); // unique name
  const createdOwnerName = validOwnerName;

  beforeEach(() => {
    cy.maybeSetupAuthMock();
    cy.login();

    cy.maybeSetupOwnersMock();
  });

  it('should create a new Owner for removal test', () => {
    cy.navigateToOwnersNew();

    typeInputNameAndSubmitSaveButtonOkFn(() => validOwnerName, false);
  });

  // Reason: not working yet
  it.skip('should remove the recently created Owner successfully', () => {
    goToOwnersListAndFilterOwnerNameAndClickButton(validOwnerName, 'delete');

    // Wait for confirmation dialog
    cy.getDataCy('remove-confirm-dialog').should('be.visible');

    // Click accept button on the dialog
    cy.getDataCy('remove-confirm-accept').click();

    // Confirm that the success message appears
    cy.getDataCy('app-toast').should('be.visible');

    // Confirm removal
    cy.getDataCy('owners-table-row').contains('td', createdOwnerName).should('not.exist');
  });
});
