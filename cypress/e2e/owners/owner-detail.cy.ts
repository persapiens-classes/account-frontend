import { detailPath, editPath, listPath, PATHS } from '../../../src/app/app.paths';
import { maybeSetupApiMockAndLogin } from '../cy-helpers';

function accessOwnerDetail(): void {
  cy.getDataCy('owners-table').should('exist');
  cy.getDataCy('detail-button').first().should('be.visible').click();
  cy.url().should('include', detailPath(PATHS.OWNER_PATH));
}

describe('Owner Detail Page', { testIsolation: false }, () => {
  before(() => {
    maybeSetupApiMockAndLogin();
  });

  beforeEach(() => {
    cy.maybeSetupApiMock();
    cy.navigateToOwnersList();
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
