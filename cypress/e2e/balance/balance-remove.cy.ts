describe('Balance Remove Page', () => {
  beforeEach(() => {
    cy.session('login', () => {
      cy.login();
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
    cy.get('[data-cy="input-initial-value"]').find('input').clear().type('10');

    // Submete
    cy.get('p-button[icon="pi pi-check"]').should('not.be.disabled').click();
    cy.get('[data-cy="app-toast"]').should('be.visible');
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
    cy.get('[data-cy="app-toast"]').should('be.visible');
  });
});
