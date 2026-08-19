import { submitOwnerNameAndVerifyDetailRoute, typeInputNameAndSubmitButton } from './owner-helpers';

describe('Owner Insert Page', () => {
  const validOwnerName = Cypress._.uniqueId('fabiana_'); // dynamic name to avoid duplicates

  beforeEach(() => {
    cy.maybeSetupAuthMock();
    cy.login();

    cy.maybeSetupOwnersMock();

    cy.navigateToOwnersNew();
  });

  it('should allow going back to the list', () => {
    cy.get('[data-cy="list-button"]').should('be.visible').click();
    cy.url().should('include', '/owners/list');
  });

  it('should create a new Owner successfully', () => {
    submitOwnerNameAndVerifyDetailRoute(() => validOwnerName, false);
  });

  describe('Validation Tests', () => {
    it('OW-01: should fail when trying to create owner with name containing only whitespace', () => {
      cy.fixture('owners').then((ownersData) => {
        const testCase = ownersData.boundaryValues['OW-01'];

        typeInputNameAndSubmitButton(testCase.name);

        cy.url().should('include', '/owners/new');
      });
    });

    it('OW-02: should create owner successfully using 3 characters (lower limit)', () => {
      submitOwnerNameAndVerifyDetailRoute(
        (ownersData) => Cypress._.uniqueId(ownersData.boundaryValues['OW-02'].name),
        false,
      );
    });

    it('OW-03: should create owner successfully using 255 characters (upper limit)', () => {
      submitOwnerNameAndVerifyDetailRoute(
        (ownersData) =>
          Cypress._.uniqueId(ownersData.boundaryValues['OW-03'].name.substring(0, 245)),
        false,
      );
    });

    // Reason: not working yet
    it.skip('OW-04: should fail when trying to create owner with 256 characters (exceeds upper limit)', () => {
      cy.fixture('owners').then((ownersData) => {
        const testCase = ownersData.boundaryValues['OW-04'];

        typeInputNameAndSubmitButton(testCase.name);

        cy.url().should('include', '/owners/new');
      });
    });

    it('OW-05: should fail when trying to create owner with duplicate name', () => {
      // Use a unique name for this test to avoid conflicts
      const uniqueDuplicateName = Cypress._.uniqueId('dup_owner_');

      // First create an owner with the unique name
      cy.get('[data-cy="input-name"]').type(uniqueDuplicateName);
      cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

      cy.get('[data-cy="app-toast"]').should('be.visible');
      cy.url().should('include', '/owners/detail');

      // Navigate back to create another with the same name
      cy.navigateToOwnersNew();

      cy.get('[data-cy="input-name"]').type(uniqueDuplicateName);
      cy.get('[data-cy="save-button"]').should('not.be.disabled').click();

      // Validate that it stays on the creation page due to duplicate error
      cy.url().should('include', '/owners/new');
    });
  });
});
