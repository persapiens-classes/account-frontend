import { listPath, loginPath, PATHS } from '../../../src/app/app.paths';

describe('LoginPage', () => {
  it('should login with valid username and password', () => {
    cy.maybeSetupApiMock();
    cy.visit(loginPath());

    cy.env(['validUsername', 'validPassword']).then(({ validUsername, validPassword }) => {
      cy.getDataCy('login-username').type(validUsername);
      cy.getDataCy('login-password').type(validPassword);
    });
    cy.getDataCy('login-button').click();

    cy.url().should('include', listPath(PATHS.BALANCE_PATH));
    cy.getDataCy('menu-balance').should('exist');
  });

  it('should display error with invalid credentials', () => {
    cy.maybeSetupApiMock('invalid');
    cy.visit(loginPath());

    cy.getDataCy('login-username').type('wronguser');
    cy.getDataCy('login-password').type('123');
    cy.getDataCy('login-button').click();

    cy.getDataCy('error-toast').should('be.visible');
  });
});
