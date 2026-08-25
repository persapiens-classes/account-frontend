import {
  goToOwnersListAndFilterOwnerNameAndClickButton,
  typeInputNameAndSubmitSaveButtonOk,
} from './owner-helpers';

describe('Owner Remove Page', () => {
  beforeEach(() => {
    cy.maybeSetupAuthMock();
    cy.maybeSetupApiMock();

    cy.login();
  });

  // Reason: not working yet
  it('should remove the recently created Owner successfully', () => {
    const validOwnerName = Cypress._.uniqueId('fabiana_'); // unique name

    cy.navigateToOwnersNew();

    // create validOwnerName to remove later
    typeInputNameAndSubmitSaveButtonOk(validOwnerName, false);

    // select validOwnerName and click delete button
    goToOwnersListAndFilterOwnerNameAndClickButton(validOwnerName, 'delete');

    // Click accept button on the dialog to confirm removal
    cy.getDataCy('remove-confirm-dialog-accept-btn').click();

    // Confirm that the success message appears
    cy.getDataCy('app-toast').should('be.visible');

    // Confirm removal
    cy.url().should('include', '/owners/list');
    cy.getDataCy('owners-table-row').should('not.exist');
  });
});
