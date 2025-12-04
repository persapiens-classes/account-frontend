describe('Credit Entry Edit Page', () => {
  beforeEach(() => {
    cy.session('login', () => {
      cy.login();
    });

    cy.visit('/balances/list');

    cy.contains('Credit Entry', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/creditEntries/list');
  });

  it('abre edição ao clicar no lápis', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('.pi.pi-pencil').click();
      });

    cy.url({ timeout: 10000 }).should('include', '/creditEntries/edit');
  });

  it('volta para a lista ao clicar no ícone de lista', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('.pi.pi-pencil').click();
      });

    cy.get('p-button[icon="pi pi-list"]').click();
    cy.url({ timeout: 10000 }).should('include', '/creditEntries/list');
  });

  it('vai para detalhes ao clicar na lupa', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('.pi.pi-pencil').click();
      });
    cy.get('p-button[icon="pi pi-search"]').click();
    cy.url({ timeout: 10000 }).should('include', '/creditEntries/detail');
  });

  it('edita nota da última credit', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('.pi.pi-pencil').click();
      });

    cy.url({ timeout: 10000 }).should('include', '/creditEntries/edit');

    // Preenche a nota adicionando _edited
    cy.get('[data-cy="input-note"] input')
      .invoke('val')
      .then((currentValue) => {
        const newValue = `${currentValue}_edited`;
        cy.get('[data-cy="input-note"] input').clear().type(newValue);
      });

    // Submete
    cy.get('p-button[icon="pi pi-check"]').click();

    // Valida que foi salvo
    cy.url({ timeout: 10000 }).should('include', '/creditEntries/detail');
  });
});
