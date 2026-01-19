describe('Owner Detail Page', () => {
  beforeEach(() => {
    cy.setupAuthMock();
    cy.setupOwnersMock();
    cy.session('login', () => {
      cy.login();
    });
    cy.visit('/balances/list');

    // Navigate to owners list
    cy.contains('Owner', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/owners/list');
  });

  function acessarOwnerDetail(): void {
    cy.get('table').should('exist');
    cy.get('[data-cy="detail-button"]').first().should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/owners/detail');
  }

  it('should access the detail page when clicking the magnifying glass', () => {
    acessarOwnerDetail();
  });

  it('should return to list when clicking the list icon', () => {
    acessarOwnerDetail();
    cy.get('[data-cy="list-button"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/owners/list');
  });

  it('should go to the edit page when clicking the pencil icon', () => {
    acessarOwnerDetail();
    cy.get('[data-cy="edit-button"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/owners/edit');
  });
});
