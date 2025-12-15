describe('Equity Account Edit Page', () => {
  beforeEach(() => {
    cy.session('login', () => {
      cy.login();
    });

    cy.visit('/balances/list');

    cy.get('p-menubar').contains('Account', { timeout: 10000 }).should('be.visible').click();
    cy.contains('Equity Account', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/equityAccounts/list');
  });

  function capturarUltimoEquityAccount(): void {
    cy.get('table tbody tr')
      .last()
      .find('td')
      .first()
      .invoke('text')
      .then((text) => text.trim())
      .as('lastEquityAccountName');
  }

  it('abre edição ao clicar no lápis', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('[data-cy="edit-button"]').click();
      });

    cy.url({ timeout: 10000 }).should('include', '/equityAccounts/edit');
  });

  it('volta para a lista ao clicar no ícone de lista', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('[data-cy="edit-button"]').click();
      });

    cy.get('[data-cy="list-button"]').click();
    cy.url({ timeout: 10000 }).should('include', '/equityAccounts/list');
  });

  it('vai para detalhes ao clicar na lupa', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('[data-cy="detail-button"]').click();
      });

    cy.url({ timeout: 10000 }).should('include', '/equityAccounts/detail');
  });

  it('edita nome do último equity', () => {
    capturarUltimoEquityAccount();

    cy.get('@lastEquityAccountName').then((originalName) => {
      cy.get('table tbody tr')
        .last()
        .within(() => {
          cy.get('[data-cy="edit-button"]').click();
        });

      cy.url({ timeout: 10000 }).should('include', '/equityAccounts/edit');

      const newName = `${originalName}_edited`;

      cy.get('[data-cy="input-description"]').clear().type(newName);

      cy.get('[data-cy="save-button"]').click();

      cy.url({ timeout: 10000 }).should('include', '/equityAccounts/detail');

      cy.contains(newName, { timeout: 10000 }).should('exist');
    });
  });
});
