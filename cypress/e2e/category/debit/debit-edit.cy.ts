describe('Debit Category Edit Page', () => {
  beforeEach(() => {
    cy.session('login', () => {
      cy.login();
    });

    cy.visit('/balances/list');

    cy.contains('Category', { timeout: 10000 }).should('be.visible').click();
    cy.contains('Debit Category', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/debitCategories/list');
  });

  function capturarUltimoDebitCategory(): void {
    cy.get('table tbody tr')
      .last()
      .find('td')
      .first()
      .invoke('text')
      .then((text) => text.trim())
      .as('lastDebitCategoryName');
  }

  it('abre edição ao clicar no lápis', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('.pi.pi-pencil').click();
      });

    cy.url({ timeout: 10000 }).should('include', '/debitCategories/edit');
  });

  it('volta para a lista ao clicar no ícone de lista', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('.pi.pi-pencil').click();
      });

    cy.get('p-button[icon="pi pi-list"]').click();
    cy.url({ timeout: 10000 }).should('include', '/debitCategories/list');
  });

  it('vai para detalhes ao clicar na lupa', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('.pi.pi-search').click();
      });

    cy.url({ timeout: 10000 }).should('include', '/debitCategories/detail');
  });

  it('edita nome do último debit', () => {
    capturarUltimoDebitCategory();

    cy.get('@lastDebitCategoryName').then((originalName) => {
      cy.get('table tbody tr')
        .last()
        .within(() => {
          cy.get('.pi.pi-pencil').click();
        });

      cy.url({ timeout: 10000 }).should('include', '/debitCategories/edit');

      const newName = `${originalName}_edited`;

      cy.get('[data-cy="input-description"]').clear().type(newName);

      cy.get('p-button[icon="pi pi-check"]').click();

      cy.url({ timeout: 10000 }).should('include', '/debitCategories/detail');

      cy.contains(newName, { timeout: 10000 }).should('exist');
    });
  });
});
