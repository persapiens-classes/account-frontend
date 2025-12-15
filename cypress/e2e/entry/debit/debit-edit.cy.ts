describe('Debit Entry Edit Page', () => {
  beforeEach(() => {
    cy.session('login', () => {
      cy.login();
    });

    cy.visit('/balances/list');

    cy.contains('Debit Entry', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/debitEntries/list');
  });

  it('abre edição ao clicar no lápis', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('[data-cy="edit-button"]').click();
      });

    cy.url({ timeout: 10000 }).should('include', '/debitEntries/edit');
  });

  it('volta para a lista ao clicar no ícone de lista', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('[data-cy="edit-button"]').click();
      });

    cy.get('[data-cy="list-button"]').click();
    cy.url({ timeout: 10000 }).should('include', '/debitEntries/list');
  });

  it('vai para detalhes ao clicar na lupa', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('[data-cy="edit-button"]').click();
      });
    cy.get('[data-cy="detail-button"]').click();
    cy.url({ timeout: 10000 }).should('include', '/debitEntries/detail');
  });

  it('edita nota da última debit', () => {
    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('[data-cy="edit-button"]').click();
      });

    cy.url({ timeout: 10000 }).should('include', '/debitEntries/edit');

    // Preenche a nota adicionando _edited
    cy.get('[data-cy="input-note"] input')
      .invoke('val')
      .then((currentValue) => {
        const newValue = `${currentValue}_edited`;
        cy.get('[data-cy="input-note"] input').clear().type(newValue);
      });

    // Submete
    cy.get('[data-cy="save-button"]').click();

    // Valida que foi salvo
    cy.url({ timeout: 10000 }).should('include', '/debitEntries/detail');
  });
});
