import { editPath } from '../../../src/app/app.paths';
import { EntryType } from '../../../src/app/entry/entry';
import { accessFirstTableDetail, clickListButtonAndVerifyListUrl } from '../cy-helpers';
import { entryPath, maybeSetupApiMockAndNatigateToEntryList } from './entry-helpers';

function accessEntryDetail(type: EntryType): void {
  accessFirstTableDetail('entries-table', entryPath(type));
}

export function entryDetailTests() {
  describe('Entry Detail Page', { testIsolation: false }, () => {
    [EntryType.CREDIT, EntryType.DEBIT, EntryType.TRANSFER].forEach((type) => {
      describe(`Type - ${type}`, () => {
        beforeEach(() => {
          maybeSetupApiMockAndNatigateToEntryList(type);
        });

        it('should access detail page when clicking magnifying glass', () => {
          accessEntryDetail(type);
        });

        it('should go back to list when clicking list icon', () => {
          accessEntryDetail(type);
          clickListButtonAndVerifyListUrl(entryPath(type));
        });

        it('should go to edit page when clicking pencil icon', () => {
          accessEntryDetail(type);
          cy.getDataCy('edit-button').should('be.visible').click();
          cy.url().should('include', editPath(entryPath(type)));
        });
      });
    });
  });
}
