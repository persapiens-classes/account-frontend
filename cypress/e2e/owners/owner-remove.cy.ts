describe('Owner Remove Page', () => {
  const validOwnerName = `fabiana_${Date.now()}`; // nome único
  let createdOwnerName = validOwnerName;

  beforeEach(() => {
    cy.session('login', () => {
      cy.visit('/login');
      cy.get('[data-cy="login-username"]').type('persapiens');
      cy.get('[data-cy="login-password"]').type('account');
      cy.get('[data-cy="login-button"]').click();
      cy.url({ timeout: 10000 }).should('include', '/balances/list');
    });
  });

  it('deve criar um novo Owner para teste de remoção', () => {
    cy.visit('/owners/new');
    cy.url().should('include', '/owners/new');

    cy.get('app-input-field input').type(validOwnerName);
    cy.get('p-button[icon="pi pi-check"]').should('not.be.disabled').click();
    cy.contains('Owner inserted', { timeout: 10000 }).should('exist');
    cy.url({ timeout: 10000 }).should('include', '/owners/detail');
  });

  it('deve remover o Owner recém-criado com sucesso', () => {
    cy.visit('/owners/list');

    cy.get('input[aria-label="Filter Name"]')
      .should('exist')
      .clear()
      .type(`${createdOwnerName}{enter}`);

    cy.contains('td', createdOwnerName, { timeout: 10000 }).should('be.visible');

    cy.contains('tr', createdOwnerName).find('.pi.pi-trash').click({ force: true });

    // Aguarda o dialog de confirmação
    cy.get('.p-dialog-mask', { timeout: 10000 }).should('be.visible');

    // Clica no botão YES (danger button)
    cy.get('.p-dialog-mask button.p-button-danger').should('be.visible').click({ force: true });

    // Confirma que foi removido
    cy.contains('td', createdOwnerName, { timeout: 10000 }).should('not.exist');
  });
});
