function accessOwnerDetail(): void {
  cy.getDataCy('owners-table').should('exist');
  cy.getDataCy('detail-button').first().should('be.visible').click();
  cy.url().should('include', '/owners/detail');
}

describe('Owner Detail Page', () => {
  beforeEach(() => {
    cy.maybeSetupAuthMock();
    cy.login();

    cy.maybeSetupOwnersMock();
    cy.navigateToOwnersList();
  });

  it('should access detail page when clicking magnifying glass', () => {
    accessOwnerDetail();
  });

  it('should go back to list when clicking list icon', () => {
    accessOwnerDetail();
    cy.getDataCy('list-button').should('be.visible').click();
    cy.url().should('include', '/owners/list');
  });

  it('should go to edit page when clicking pencil icon', () => {
    accessOwnerDetail();
    cy.getDataCy('edit-button').should('be.visible').click();
    cy.url().should('include', '/owners/edit');
  });
});
