import { editPath } from '../../../src/app/app.paths';
import { EntryType } from '../../../src/app/entry/entry';
import { clickEditButtonInTableRowAndCheckEditRoute } from '../cy-helpers';
import {
  entryPath,
  fillEntryFieldsAndSubmitSaveButtonOk,
  maybeSetupApiMockAndNatigateToEntryList,
} from './entry-helpers';

function captureLastEntry(): void {
  cy.getDataCy('entries-table-row')
    .last()
    .find('td')
    .first()
    .invoke('text')
    .then((text) => text.trim())
    .as('lastEntryDescription');
}

function clickEditButtonInEntriesTableRowAndCheckEditRoute(type: EntryType) {
  clickEditButtonInTableRowAndCheckEditRoute('entries-table-row', entryPath(type));
}

export function entryEditTests() {
  describe('Entry Edit Page', { testIsolation: false }, () => {
    [EntryType.CREDIT, EntryType.DEBIT, EntryType.TRANSFER].forEach((type) => {
      describe(`Type - ${type}`, () => {
        beforeEach(() => {
          maybeSetupApiMockAndNatigateToEntryList(type);
        });

        it('clicking pencil on last entry opens edit', () => {
          captureLastEntry();

          cy.get<string>('@lastEntryDescription').then(() => {
            clickEditButtonInEntriesTableRowAndCheckEditRoute(type);
          });
          cy.url().should('include', editPath(entryPath(type)));
        });

        it('edit last entry by adding _edited to the description', () => {
          captureLastEntry();

          cy.get<string>('@lastEntryDescription').then(() => {
            clickEditButtonInEntriesTableRowAndCheckEditRoute(type);
            cy.entriesDefault(type).then((entries) => {
              const validEntry = entries.at(0)!;

              validEntry.note = `${validEntry.note}_edited`;

              fillEntryFieldsAndSubmitSaveButtonOk(type, validEntry, true);
            });
          });
        });
      });
    });
  });
}
