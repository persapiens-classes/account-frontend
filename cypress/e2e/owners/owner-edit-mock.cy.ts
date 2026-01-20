describe('Owner Edit Page (Mock)', () => {
  beforeEach(() => {
    cy.session('login', () => {
      cy.setupAuthMock('success');
      cy.login();
    });

    cy.setupOwnersMock();
    cy.visit('/balances/list');

    // Navigate to owners list
    cy.contains('Owner', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/owners/list');
  });

  function captureLastOwner(): void {
    cy.get('[data-cy="owners-table"] tbody tr')
      .last()
      .find('td')
      .first()
      .invoke('text')
      .then((text) => text.trim())
      .as('lastOwnerName');
  }

  it('clicking pencil on last owner opens edit', () => {
    cy.get('[data-cy="owners-table"] tbody tr')
      .last()
      .within(() => {
        cy.get('[data-cy="edit-button"]').should('be.visible').click();
      });

    cy.url({ timeout: 10000 }).should('include', '/owners/edit');
  });

  it('go back to list using list icon', () => {
    cy.get('[data-cy="owners-table"] tbody tr')
      .last()
      .within(() => {
        cy.get('[data-cy="edit-button"]').should('be.visible').click();
      });

    cy.url({ timeout: 10000 }).should('include', '/owners/edit');

    cy.get('[data-cy="list-button"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/owners/list');
  });

  it('navigation: clicking magnifying glass on last owner goes to details', () => {
    cy.get('[data-cy="owners-table"] tbody tr')
      .last()
      .within(() => {
        cy.get('[data-cy="detail-button"]').should('be.visible').click();
      });

    cy.url({ timeout: 10000 }).should('include', '/owners/detail');
  });

  it('edit last owner by adding _edited to the name', () => {
    captureLastOwner();

    cy.get('@lastOwnerName').then((originalName) => {
      cy.get('[data-cy="owners-table"] tbody tr')
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

      cy.wait('@updateOwner').its('response.statusCode').should('eq', 200);

      cy.url({ timeout: 10000 }).should('include', '/owners/detail');
      cy.contains(newName, { timeout: 10000 }).should('exist');
    });
  });

  describe('Validation Tests', () => {
    beforeEach(() => {
      // Navigate to edit page for each validation test
      cy.visit('/owners/list');
      cy.url({ timeout: 10000 }).should('include', '/owners/list');

      // Click edit button on last owner
      cy.get('table tbody tr').last().find('[data-cy="edit-button"]').click();
      cy.url({ timeout: 10000 }).should('include', '/owners/edit');
    });

    it('OW-01: should fail when trying to edit owner with name containing only whitespace', () => {
      cy.fixture('owners').then((ownersData) => {
        const testCase = ownersData.boundaryValues['OW-01'];

        cy.get('[data-cy="input-name"]').clear().type(testCase.name);
        cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

        cy.wait('@updateOwner').its('response.statusCode').should('eq', 400);

        cy.url({ timeout: 5000 }).should('include', '/owners/edit');
      });
    });

    it('OW-02: should edit owner successfully using 3 characters (lower limit)', () => {
      cy.fixture('owners').then((ownersData) => {
        const testCase = ownersData.boundaryValues['OW-02'];
        const uniqueName = `${testCase.name}_${Date.now()}`;

        cy.get('[data-cy="input-name"]').clear().type(uniqueName);
        cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

        cy.wait('@updateOwner').its('response.statusCode').should('eq', 200);

        cy.get('[data-cy="app-toast"]', { timeout: 10000 }).should('be.visible');
        cy.url({ timeout: 10000 }).should('include', '/owners/detail');
      });
    });

    it('OW-03: should edit owner successfully using 255 characters (upper limit)', () => {
      cy.fixture('owners').then((ownersData) => {
        const testCase = ownersData.boundaryValues['OW-03'];
        const uniqueName = testCase.name.substring(0, 245) + Date.now();

        cy.get('[data-cy="input-name"]').clear().type(uniqueName);
        cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

        cy.wait('@updateOwner').its('response.statusCode').should('eq', 200);

        cy.get('[data-cy="app-toast"]', { timeout: 10000 }).should('be.visible');
        cy.url({ timeout: 10000 }).should('include', '/owners/detail');
      });
    });

    it.skip('OW-04: should fail when trying to edit owner with 256 characters (exceeds upper limit)', () => {
      cy.fixture('owners').then((ownersData) => {
        const testCase = ownersData.boundaryValues['OW-04'];

        cy.get('[data-cy="input-name"]').clear().type(testCase.name);
        cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

        cy.wait('@updateOwner').its('response.statusCode').should('eq', 400);

        cy.url({ timeout: 5000 }).should('include', '/owners/edit');
      });
    });

    it('OW-05: should fail when trying to edit owner with existing name', () => {
      cy.fixture('owners').then((ownersData) => {
        const testCase = ownersData.boundaryValues['OW-05'];

        // Try to change to a duplicate name (from fixtures)
        cy.get('[data-cy="input-name"]').clear().type(testCase.name);
        cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

        cy.wait('@updateOwner').its('response.statusCode').should('eq', 409);

        cy.url({ timeout: 5000 }).should('include', '/owners/edit');
      });
    });
  });
});
