describe('Credit Entry Remove Page', () => {
  const uniqueValue = `credit_remove_${Date.now()}`;

  beforeEach(() => {
    cy.session('login', () => {
      cy.visit('/login');
      cy.get('[data-cy="login-username"]').type('persapiens');
      cy.get('[data-cy="login-password"]').type('account');
      cy.get('[data-cy="login-button"]').click();
      cy.url({ timeout: 10000 }).should('include', '/balances/list');
    });
  });

  it('deve criar uma nova Credit Entry para teste de remoção', () => {
    cy.visit('/creditEntries/new');
    cy.url().should('include', '/creditEntries/new');

    // Preenche a data
    cy.get('app-date-field p-date-picker').click();
    cy.get('.p-datepicker-today').click();

    // Seleciona In Owner - penúltima opção
    cy.get('p-select[data-cy="select-in-owner"]').click();
    cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
    cy.get('[role="option"]').eq(-2).click();

    // Seleciona In Account - penúltima opção
    cy.get('p-select[data-cy="select-in-account"]').click();
    cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
    cy.get('[role="option"]').eq(-2).click();

    // Seleciona Out Owner - primeira opção
    cy.get('p-select[data-cy="select-out-owner"]').click();
    cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
    cy.get('[role="option"]').first().click();

    // Seleciona Out Account - primeira opção
    cy.get('p-select[data-cy="select-out-account"]').click();
    cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
    cy.get('[role="option"]').first().click();

    // Preenche o valor com número único
    cy.get('app-number-field input')
      .clear()
      .type(Math.floor(Math.random() * 1000).toString());

    // Preenche a nota com identificador único
    cy.get('app-input-field[formControlName="inputNote"] input').type(uniqueValue);

    // Submete
    cy.get('p-button[icon="pi pi-check"]').should('not.be.disabled').click();
    cy.contains('Credit Entry inserted', { timeout: 10000 }).should('exist');
    cy.url({ timeout: 10000 }).should('include', '/creditEntries/detail');
  });

  it('deve remover a última Credit Entry criada com sucesso', () => {
    cy.visit('/creditEntries/list');
    cy.url().should('include', '/creditEntries/list');

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
    cy.contains('Credit Entry removed', { timeout: 10000 }).should('exist');
  });
});
