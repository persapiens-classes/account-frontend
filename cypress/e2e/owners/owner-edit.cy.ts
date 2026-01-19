describe('Owner Edit Page', () => {
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

  function capturarUltimoOwner(): void {
    cy.get('table tbody tr')
      .last()
      .find('td')
      .first()
      .invoke('text')
      .then((text) => text.trim())
      .as('lastOwnerName');
  }

  it('clicking the pencil of the last owner opens editing', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('[data-cy="edit-button"]').should('be.visible').click();
      });

    cy.url({ timeout: 10000 }).should('include', '/owners/edit');
  });

  it('return to list with the list icon', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('[data-cy="edit-button"]').should('be.visible').click();
      });

    cy.url({ timeout: 10000 }).should('include', '/owners/edit');

    cy.get('[data-cy="list-button"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/owners/list');
  });

  it('navigation: click the magnifying glass of the last owner goes to details', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('[data-cy="detail-button"]').should('be.visible').click();
      });

    cy.url({ timeout: 10000 }).should('include', '/owners/detail');
  });

  it('edit the last owner by adding _edited to the name', () => {
    capturarUltimoOwner();

    cy.get('@lastOwnerName').then((originalName) => {
      cy.get('table tbody tr')
        .last()
        .within(() => {
          cy.get('[data-cy="edit-button"]').should('be.visible').click();
        });

      cy.url({ timeout: 10000 }).should('include', '/owners/edit');

      const newName = `${originalName}_edited`;

      cy.get('[data-cy="input-name"]', { timeout: 10000 })
        .should('be.visible')
        .clear()
        .type(newName);

      cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

      cy.url({ timeout: 10000 }).should('include', '/owners/detail');
      cy.contains(newName, { timeout: 10000 }).should('exist');
    });
  });
});
