import { listPath, loginPath, PATHS } from '../../../src/app/app.paths';

describe('Logout Page', () => {
  beforeEach(() => {
    cy.maybeSetupApiMock();
    cy.login();
  });

  it('should display login page after logout', () => {
    cy.getDataCy('logout-button').click();
    cy.wait('@logoutRequest');

    // Validates that it is on the login page
    cy.url().should('include', loginPath());
    cy.getDataCy('login-username').should('exist');
    cy.getDataCy('login-password').should('exist');
    cy.getDataCy('login-button').should('exist');
  });

  it('should not be able to access protected pages after logout', () => {
    cy.getDataCy('logout-button').click();
    cy.wait('@logoutRequest');
    cy.url().should('include', loginPath());

    // Tries to access a protected page
    cy.visit(listPath(PATHS.BALANCE_PATH));

    // Should be redirected to login
    cy.url().should('include', loginPath());
  });
});
