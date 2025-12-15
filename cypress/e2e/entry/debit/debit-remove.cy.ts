describe('Debit Entry Remove Page', () => {
  const uniqueValue = `debit_remove_${Date.now()}`;

  beforeEach(() => {
    cy.session('login', () => {
      cy.login();
    });
  });

  it('deve criar uma nova Debit Entry para teste de remoção', () => {
    cy.visit('/debitEntries/new');
    cy.url().should('include', '/debitEntries/new');

    // Preenche a data
    cy.get('[data-cy="input-date"]').click();
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
    cy.get('[data-cy="input-value"]')
      .find('input')
      .clear()
      .type((Date.now() % 1000).toString());

    // Preenche a nota com identificador único
    cy.get('[data-cy="input-note"]').find('input').type(uniqueValue);

    // Submete
    cy.get('[data-cy="save-button"]').should('not.be.disabled').click();
    cy.get('[data-cy="app-toast"]').should('be.visible');
    cy.url({ timeout: 10000 }).should('include', '/debitEntries/detail');
  });

  it('deve remover a última Debit Entry criada com sucesso', () => {
    cy.visit('/debitEntries/list');
    cy.url().should('include', '/debitEntries/list');

    // Aguarda a tabela carregar
    cy.get('table', { timeout: 10000 }).should('exist');

    // Pega a última linha da tabela e clica no ícone de lixo
    cy.get('table tbody tr')
      .last()
      .then((lastRow) => {
        cy.wrap(lastRow).find('[data-cy="delete-button"]').click({ force: true });
      });

    // Aguarda o dialog de confirmação
    cy.get('.p-dialog-mask', { timeout: 10000 }).should('be.visible');

    // Clica no botão YES (danger button)
    cy.get('.p-dialog-mask button.p-button-danger').should('be.visible').click({ force: true });

    // Confirma que foi removida com sucesso
    cy.get('[data-cy="app-toast"]').should('be.visible');
  });
});
