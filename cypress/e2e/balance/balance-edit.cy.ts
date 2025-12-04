describe('Balance Edit Page', () => {
  beforeEach(() => {
    cy.session('login', () => {
      cy.login();
    });

    cy.visit('/balances/list');
  });

  it('abre edição ao clicar no lápis', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('.pi.pi-pencil').click();
      });

    cy.url({ timeout: 10000 }).should('include', '/balances/edit');
  });

  it('volta para a lista ao clicar no ícone de lista', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('.pi.pi-pencil').click();
      });

    cy.get('p-button[icon="pi pi-list"]').click();
    cy.url({ timeout: 10000 }).should('include', '/balances/list');
  });

  it('vai para detalhes ao clicar na lupa', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('.pi.pi-pencil').click();
      });
    cy.get('p-button[icon="pi pi-search"]').click();
    cy.url({ timeout: 10000 }).should('include', '/balances/detail');
  });

  it('salva sem alterar nada', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('.pi.pi-pencil').click();
      });

    cy.url({ timeout: 10000 }).should('include', '/balances/edit');

    // Clica em salvar
    cy.get('p-button[icon="pi pi-check"]').click();

    // Valida que foi salvo
    cy.url({ timeout: 10000 }).should('include', '/balances/detail');
  });
});
