describe('Equity Category Edit Page', () => {
  beforeEach(() => {
    cy.session('login', () => {
      cy.login();
    });

    cy.visit('/balances/list');

    cy.contains('Category', { timeout: 10000 }).should('be.visible').click();
    cy.contains('Equity Category', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/equityCategories/list');
  });

  function capturarUltimoEquityCategory(): void {
    cy.get('table tbody tr')
      .last()
      .find('td')
      .first()
      .invoke('text')
      .then((text) => text.trim())
      .as('lastEquityCategoryName');
  }

  it('abre edição ao clicar no lápis', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('[data-cy="edit-button"]').click();
      });

    cy.url({ timeout: 10000 }).should('include', '/equityCategories/edit');
  });

  it('volta para a lista ao clicar no ícone de lista', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('[data-cy="edit-button"]').click();
      });

    cy.get('[data-cy="list-button"]').click();
    cy.url({ timeout: 10000 }).should('include', '/equityCategories/list');
  });

  it('vai para detalhes ao clicar na lupa', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('[data-cy="detail-button"]').click();
      });

    cy.url({ timeout: 10000 }).should('include', '/equityCategories/detail');
  });

  it('edita nome do último equity', () => {
    capturarUltimoEquityCategory();

    cy.get('@lastEquityCategoryName').then((originalName) => {
      cy.get('table tbody tr')
        .last()
        .within(() => {
          cy.get('[data-cy="edit-button"]').click();
        });

      cy.url({ timeout: 10000 }).should('include', '/equityCategories/edit');

      const newName = `${originalName}_edited`;

      cy.get('[data-cy="input-description"]').clear().type(newName);

      cy.get('[data-cy="save-button"]').click();

      cy.url({ timeout: 10000 }).should('include', '/equityCategories/detail');

      cy.contains(newName, { timeout: 10000 }).should('exist');
    });
  });
});
