describe('Credit Category Edit Page', () => {
  beforeEach(() => {
    cy.session('login', () => {
      cy.login();
    });

    cy.visit('/balances/list');

    cy.contains('Category', { timeout: 10000 }).should('be.visible').click();
    cy.contains('Credit Category', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/creditCategories/list');
  });

  function capturarUltimoCreditCategory(): void {
    cy.get('table tbody tr')
      .last()
      .find('td')
      .first()
      .invoke('text')
      .then((text) => text.trim())
      .as('lastCreditCategoryName');
  }

  it('abre edição ao clicar no lápis', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('.pi.pi-pencil').click();
      });

    cy.url({ timeout: 10000 }).should('include', '/creditCategories/edit');
  });

  it('volta para a lista ao clicar no ícone de lista', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('.pi.pi-pencil').click();
      });

    cy.get('p-button[icon="pi pi-list"]').click();
    cy.url({ timeout: 10000 }).should('include', '/creditCategories/list');
  });

  it('vai para detalhes ao clicar na lupa', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('.pi.pi-search').click();
      });

    cy.url({ timeout: 10000 }).should('include', '/creditCategories/detail');
  });

  it('edita nome do último credit', () => {
    capturarUltimoCreditCategory();

    cy.get('@lastCreditCategoryName').then((originalName) => {
      cy.get('table tbody tr')
        .last()
        .within(() => {
          cy.get('.pi.pi-pencil').click();
        });

      cy.url({ timeout: 10000 }).should('include', '/creditCategories/edit');

      const newName = `${originalName}_edited`;

      cy.get('[data-cy="input-description"]').clear().type(newName);

      cy.get('p-button[icon="pi pi-check"]').click();

      cy.url({ timeout: 10000 }).should('include', '/creditCategories/detail');

      cy.contains(newName, { timeout: 10000 }).should('exist');
    });
  });
});
