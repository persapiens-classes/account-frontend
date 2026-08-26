import {
  goToOwnersListAndFilterOwnerNameAndClickButton,
  typeInputNameAndSubmitSaveButtonOk,
} from './owner-helpers';
import { PATHS } from '../../../src/app/app.paths';
import { clickRemoveButtonAndConfirRemoval } from '../cy-helpers';

describe('Owner Remove Page', () => {
  beforeEach(() => {
    cy.maybeSetupApiMock();

    cy.login();
  });

  // Reason: not working yet
  it('should remove the recently created Owner successfully', () => {
    const validOwnerName = Cypress._.uniqueId('fabiana_'); // unique name

    cy.navigateToOwnersNew();

    // create validOwnerName to remove later
    typeInputNameAndSubmitSaveButtonOk(validOwnerName, validOwnerName, false);

    // select validOwnerName and click delete button
    goToOwnersListAndFilterOwnerNameAndClickButton(validOwnerName, 'delete');

    clickRemoveButtonAndConfirRemoval('owners-table-row', PATHS.OWNER_PATH);
  });
});
