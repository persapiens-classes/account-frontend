describe('Owner Edit Page', () => {
  beforeEach(() => {
    cy.session('login', () => {
      cy.visit('/login');
      cy.get('[data-cy="login-username"]').type('persapiens');
      cy.get('[data-cy="login-password"]').type('account');
      cy.get('[data-cy="login-button"]').click();
      cy.url({ timeout: 10000 }).should('include', '/balances/list');
    });

    cy.visit('/balances/list');

    // Navega para lista de owners
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

  it('clicar no lápis do último owner abre a edição', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('.pi.pi-pencil').should('be.visible').click();
      });

    cy.url({ timeout: 10000 }).should('include', '/owners/edit');
  });

  it('voltar para a lista com o ícone de lista', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('.pi.pi-pencil').should('be.visible').click();
      });

    cy.url({ timeout: 10000 }).should('include', '/owners/edit');

    cy.get('p-button[icon="pi pi-list"]').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/owners/list');
  });

  it('navegação: clicar na lupa do último owner vai para detalhes', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('.pi.pi-search').should('be.visible').click();
      });

    cy.url({ timeout: 10000 }).should('include', '/owners/detail');
  });

  it('editar o último owner adicionando _edited ao nome', () => {
    capturarUltimoOwner();

    cy.get('@lastOwnerName').then((originalName) => {
      cy.get('table tbody tr')
        .last()
        .within(() => {
          cy.get('.pi.pi-pencil').should('be.visible').click();
        });

      cy.url({ timeout: 10000 }).should('include', '/owners/edit');

      const newName = `${originalName}_edited`;

      cy.get('[data-cy="input-name"]', { timeout: 10000 })
        .should('be.visible')
        .clear()
        .type(newName);

      cy.get('p-button[icon="pi pi-check"]').should('not.be.disabled').click();

      cy.url({ timeout: 10000 }).should('include', '/owners/detail');
      cy.contains(newName, { timeout: 10000 }).should('exist');
    });
  });
});
