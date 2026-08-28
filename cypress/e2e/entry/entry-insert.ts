import { listPath, newPath } from '../../../src/app/app.paths';
import { EntryType } from '../../../src/app/entry/entry';
import {
  entryPath,
  fillEntryFieldsAndSubmitSaveButtonOk,
  fillEntryFieldsAndSubmitSaveButtonFail,
} from './entry-helpers';

export function entryInsertTests() {
  describe('Entry Insert Page', { testIsolation: false }, () => {
    [EntryType.CREDIT, EntryType.DEBIT, EntryType.TRANSFER].forEach((type) => {
      describe(`Type - ${type}`, () => {
        beforeEach(() => {
          cy.maybeSetupApiMock();
          cy.navigateToEntryNew(type);
        });

        it('should allow going back to the list', () => {
          cy.getDataCy('list-button').should('be.visible').click();
          cy.url().should('include', listPath(entryPath(type)));
        });

        it('should create a new Entry successfully', () => {
          cy.entriesDefault(type).then((entries) => {
            const validEntry = entries.at(0)!;

            fillEntryFieldsAndSubmitSaveButtonOk(type, validEntry, false);
          });
        });

        describe('Validation Tests', () => {
          it('OW-01: should fail when not selecting an in-owner account', () => {
            cy.entriesDefault(type).then((entries) => {
              const validEntry = entries.at(0)!;
              fillEntryFieldsAndSubmitSaveButtonFail(validEntry, false);

              cy.url().should('include', newPath(entryPath(type)));
            });
          });
        });
      });
    });
  });
}
