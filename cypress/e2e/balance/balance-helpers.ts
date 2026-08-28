export function maybeSetupApiMockAndNatigateToBalanceList() {
  cy.maybeSetupApiMock();
  cy.navigateToBalanceList();
}
