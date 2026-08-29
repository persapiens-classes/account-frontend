import { editPath } from '../../../src/app/app.paths';
import { EntryType } from '../../../src/app/entry/entry';
import { clickEditButtonInTableRowAndCheckEditRoute } from '../cy-helpers';
import {
  entryPath,
  fillEntryFieldsAndSubmitSaveButtonOk,
  maybeSetupApiMockAndNatigateToEntryList,
} from './entry-helpers';

function clickEditButtonInEntriesTableRowAndCheckEditRoute(type: EntryType, index: number) {
  clickEditButtonInTableRowAndCheckEditRoute('entries-table-row', entryPath(type), index);
}

export function entryEditTests() {
  describe('Entry Edit Page', { testIsolation: false }, () => {
    [EntryType.CREDIT, EntryType.DEBIT, EntryType.TRANSFER].forEach((type) => {
      describe(`Type - ${type}`, () => {
        beforeEach(() => {
          maybeSetupApiMockAndNatigateToEntryList(type);
        });

        it('clicking pencil on first entry opens edit', () => {
          clickEditButtonInEntriesTableRowAndCheckEditRoute(type, 0);
          cy.url().should('include', editPath(entryPath(type)));
        });

        it('edit first entry by adding _edited to the description', () => {
          cy.entriesDefault(type).then((entries) => {
            const index = 0;
            clickEditButtonInEntriesTableRowAndCheckEditRoute(type, index);
            const validEntry = entries.at(index)!;

            validEntry.note = `${validEntry.note}_edited`;

            fillEntryFieldsAndSubmitSaveButtonOk(type, validEntry, true);
          });
        });
      });
    });
  });
}
