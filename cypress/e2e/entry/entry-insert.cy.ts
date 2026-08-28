import { listPath, newPath } from '../../../src/app/app.paths';
import { EntryType } from '../../../src/app/entry/entry';
import { entriesDefault } from '../../support/fakers/models-default';
import { maybeSetupApiMockAndLogin } from '../cy-helpers';
import {
  entryPath,
  fillEntryFieldsAndSubmitSaveButtonOk,
  fillEntryFieldsAndSubmitSaveButtonFail,
} from './entry-helpers';

describe('Entry Insert Page', { testIsolation: false }, () => {
  before(() => {
    console.log('before maybeSetupApiMockAndLogin');
    maybeSetupApiMockAndLogin();
    console.log('after maybeSetupApiMockAndLogin');
  });

  [EntryType.CREDIT, EntryType.DEBIT, EntryType.TRANSFER].forEach((type) => {
    describe(`Type - ${type}`, () => {
      beforeEach(() => {
        console.log('beforeEach maybeSetupApiMock');
        cy.maybeSetupApiMock();
        cy.navigateToEntryNew(type);
        console.log('after maybeSetupApiMock');
      });

      it('should allow going back to the list', () => {
        cy.getDataCy('list-button').should('be.visible').click();
        cy.url().should('include', listPath(entryPath(type)));
      });

      it('should create a new Entry successfully', () => {
        const validEntry = entriesDefault(type).at(0)!;
        console.log('validEntry:', validEntry);

        fillEntryFieldsAndSubmitSaveButtonOk(type, validEntry, false);
      });

      describe('Validation Tests', () => {
        it('OW-01: should fail when not selecting an in-owner account', () => {
          const validEntry = entriesDefault(type).at(0)!;
          fillEntryFieldsAndSubmitSaveButtonFail(validEntry, false);

          cy.url().should('include', newPath(entryPath(type)));
        });
      });
    });
  });
});
