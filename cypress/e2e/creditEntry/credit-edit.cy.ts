describe('Credit Entry Edit Page', () => {
  beforeEach(() => {
    cy.session('login', () => {
      cy.visit('/login');
      cy.get('[data-cy="login-username"]').type('persapiens');
      cy.get('[data-cy="login-password"]').type('account');
      cy.get('[data-cy="login-button"]').click();
      cy.url({ timeout: 10000 }).should('include', '/balances/list');
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
    cy.get('app-input-field[formControlName="inputNote"] input')
      .invoke('val')
      .then((currentValue) => {
        const newValue = `${currentValue}_edited`;
        cy.get('app-input-field[formControlName="inputNote"] input').clear().type(newValue);
      });

    // Submete
    cy.get('p-button[icon="pi pi-check"]').click();

    // Valida que foi salvo
    cy.url({ timeout: 10000 }).should('include', '/creditEntries/detail');
  });
});
