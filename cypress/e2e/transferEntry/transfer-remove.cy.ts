describe('Transfer Entry Remove Page', () => {
  const uniqueValue = `transfer_remove_${Date.now()}`;

  beforeEach(() => {
    cy.session('login', () => {
      cy.visit('/login');
      cy.get('[data-cy="login-username"]').type('persapiens');
      cy.get('[data-cy="login-password"]').type('account');
      cy.get('[data-cy="login-button"]').click();
      cy.url({ timeout: 10000 }).should('include', '/balances/list');
    });
  });

  it('deve criar uma nova Transfer Entry para teste de remoção', () => {
    cy.visit('/transferEntries/new');
    cy.url().should('include', '/transferEntries/new');

    // Preenche a data
    cy.get('[data-cy="input-date"]').click();
    cy.get('.p-datepicker-today').click();

    // Seleciona In Owner - penúltima opção
    cy.get('[data-cy="select-in-owner"]').click();
    cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
    cy.get('[role="option"]').eq(-2).click();

    // Seleciona In Account - penúltima opção
    cy.get('[data-cy="select-in-account"]').click();
    cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
    cy.get('[role="option"]').eq(-2).click();

    // Seleciona Out Owner - primeira opção
    cy.get('[data-cy="select-out-owner"]').click();
    cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
    cy.get('[role="option"]').first().click();

    // Seleciona Out Account - primeira opção
    cy.get('[data-cy="select-out-account"]').click();
    cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
    cy.get('[role="option"]').first().click();

    // Preenche o valor com número único
    cy.get('[data-cy="input-value"]').find('input')
      .clear()
      .type(Math.floor(Math.random() * 1000).toString());

    // Preenche a nota com identificador único
    cy.get('[data-cy="input-note"]').type(uniqueValue);

    // Submete
    cy.get('p-button[icon="pi pi-check"]').should('not.be.disabled').click();
    cy.contains('Transfer Entry inserted', { timeout: 10000 }).should('exist');
    cy.url({ timeout: 10000 }).should('include', '/transferEntries/detail');
  });

  it('deve remover a última Transfer Entry criada com sucesso', () => {
    cy.visit('/transferEntries/list');
    cy.url().should('include', '/transferEntries/list');

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

    // Confirma que foi removida com sucesso
    cy.contains('Transfer Entry removed', { timeout: 10000 }).should('exist');
  });
});
