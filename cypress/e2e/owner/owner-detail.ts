import { editPath, listPath, PATHS } from '../../../src/app/app.paths';
import { accessFirstTableDetail } from '../cy-helpers';

function accessOwnerDetail(): void {
  accessFirstTableDetail('owners-table', PATHS.OWNER_PATH);
}

describe('Owner Detail Page', { testIsolation: false }, () => {
  beforeEach(() => {
    cy.maybeSetupApiMock();
    cy.navigateToOwnerList();
  });

  it('should access detail page when clicking magnifying glass', () => {
    accessOwnerDetail();
  });

  it('should go back to list when clicking list icon', () => {
    accessOwnerDetail();
    cy.getDataCy('list-button').should('be.visible').click();
    cy.url().should('include', listPath(PATHS.OWNER_PATH));
  });

  it('should go to edit page when clicking pencil icon', () => {
    accessOwnerDetail();
    cy.getDataCy('edit-button').should('be.visible').click();
    cy.url().should('include', editPath(PATHS.OWNER_PATH));
  });
});
