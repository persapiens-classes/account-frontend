describe('Balance Remove Page', () => {
  const uniqueValue = `balance_remove_${Date.now()}`;

  beforeEach(() => {
    cy.session('login', () => {
      cy.visit('/login');
      cy.get('[data-cy="login-username"]').type('persapiens');
      cy.get('[data-cy="login-password"]').type('account');
      cy.get('[data-cy="login-button"]').click();
      cy.url({ timeout: 10000 }).should('include', '/balances/list');
    });
  });

  it('deve criar um novo Balance para teste de remoção', () => {
    cy.visit('/balances/new');
    cy.url().should('include', '/balances/new');

    // Seleciona Owner - penúltima opção
    cy.get('p-select[data-cy="select-owner"]').click();
    cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
    cy.get('[role="option"]').eq(-2).click();

    // Seleciona Equity Account - penúltima opção
    cy.get('p-select[data-cy="select-equity-account"]').click();
    cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
    cy.get('[role="option"]').eq(-2).click();

    // Preenche o valor inicial
    cy.get('app-number-field input').clear().type('10');

    // Submete
    cy.get('p-button[icon="pi pi-check"]').should('not.be.disabled').click();
    cy.contains('Balances inserted', { timeout: 10000 }).should('exist');
    cy.url({ timeout: 10000 }).should('include', '/balances/detail');
  });

  it('deve remover o último Balance criado com sucesso', () => {
    cy.visit('/balances/list');
    cy.url().should('include', '/balances/list');

    // Aguarda a tabela carregar
    cy.get('table', { timeout: 10000 }).should('exist');

    // Pega a última linha da tabela e clica no ícone de lixo
    cy.get('table tbody tr')
      .last()
      .then((lastRow) => {
        cy.wrap(lastRow).find('.pi.pi-trash').click({ force: true });
      });

    // Aguarda o dialog de confirmação
    cy.get('.p-dialog-mask', { timeout: 10000 }).should('be.visible');

    // Clica no botão YES (danger button)
    cy.get('.p-dialog-mask button.p-button-danger').should('be.visible').click({ force: true });

    // Confirma que foi removido
    cy.contains('Balance removed ok', { timeout: 10000 }).should('exist');
  });
});
