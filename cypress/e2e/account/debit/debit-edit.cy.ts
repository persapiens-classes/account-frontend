describe('Debit Account Edit Page', () => {
  beforeEach(() => {
    cy.session('login', () => {
      cy.visit('/login');
      cy.get('[data-cy="login-username"]').type('persapiens');
      cy.get('[data-cy="login-password"]').type('account');
      cy.get('[data-cy="login-button"]').click();
      cy.url({ timeout: 10000 }).should('include', '/balances/list');
    });

    cy.visit('/balances/list');

    cy.get('p-menubar').contains('Account', { timeout: 10000 }).should('be.visible').click();
    cy.contains('Debit Account', { timeout: 10000 }).click();
    cy.url({ timeout: 10000 }).should('include', '/debitAccounts/list');
  });

  function capturarUltimoDebitAccount(): void {
    cy.get('table tbody tr')
      .last()
      .find('td')
      .first()
      .invoke('text')
      .then((text) => text.trim())
      .as('lastDebitAccountName');
  }

  it('abre edição ao clicar no lápis', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('.pi.pi-pencil').click();
      });

    cy.url({ timeout: 10000 }).should('include', '/debitAccounts/edit');
  });

  it('volta para a lista ao clicar no ícone de lista', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('.pi.pi-pencil').click();
      });

    cy.get('p-button[icon="pi pi-list"]').click();
    cy.url({ timeout: 10000 }).should('include', '/debitAccounts/list');
  });

  it('vai para detalhes ao clicar na lupa', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('.pi.pi-search').click();
      });

    cy.url({ timeout: 10000 }).should('include', '/debitAccounts/detail');
  });

  it('edita nome do último debit', () => {
    capturarUltimoDebitAccount();

    cy.get('@lastDebitAccountName').then((originalName) => {
      cy.get('table tbody tr')
        .last()
        .within(() => {
          cy.get('.pi.pi-pencil').click();
        });

      cy.url({ timeout: 10000 }).should('include', '/debitAccounts/edit');

      const newName = `${originalName}_edited`;

      cy.get('[data-cy="input-description"]').clear().type(newName);

      cy.get('p-button[icon="pi pi-check"]').click();

      cy.url({ timeout: 10000 }).should('include', '/debitAccounts/detail');

      cy.contains(newName, { timeout: 10000 }).should('exist');
    });
  });
});
