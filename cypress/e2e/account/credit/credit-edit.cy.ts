describe('Credit Account Edit Page', () => {
  beforeEach(() => {
    cy.session('login', () => {
      cy.login();
    });

    cy.visit('/balances/list');

    cy.get('p-menubar').contains('Account', { timeout: 10000 }).should('be.visible').click();
    cy.contains('Credit Account', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/creditAccounts/list');
  });

  function capturarUltimoCreditAccount(): void {
    cy.get('table tbody tr')
      .last()
      .find('td')
      .first()
      .invoke('text')
      .then((text) => text.trim())
      .as('lastCreditAccountName');
  }

  it('abre edição ao clicar no lápis', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('.pi.pi-pencil').click();
      });

    cy.url({ timeout: 10000 }).should('include', '/creditAccounts/edit');
  });

  it('volta para a lista ao clicar no ícone de lista', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('.pi.pi-pencil').click();
      });

    cy.get('p-button[icon="pi pi-list"]').click();
    cy.url({ timeout: 10000 }).should('include', '/creditAccounts/list');
  });

  it('vai para detalhes ao clicar na lupa', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('.pi.pi-search').click();
      });

    cy.url({ timeout: 10000 }).should('include', '/creditAccounts/detail');
  });

  it('edita nome do último credit', () => {
    capturarUltimoCreditAccount();

    cy.get('@lastCreditAccountName').then((originalName) => {
      cy.get('table tbody tr')
        .last()
        .within(() => {
          cy.get('.pi.pi-pencil').click();
        });

      cy.url({ timeout: 10000 }).should('include', '/creditAccounts/edit');

      const newName = `${originalName}_edited`;

      cy.get('[data-cy="input-description"]').clear().type(newName);

      cy.get('p-button[icon="pi pi-check"]').click();

      cy.url({ timeout: 10000 }).should('include', '/creditAccounts/detail');

      cy.contains(newName, { timeout: 10000 }).should('exist');
    });
  });
});
