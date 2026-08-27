import { editPath } from '../../../src/app/app.paths';
import { EntryType } from '../../../src/app/entry/entry';
import {
  accessFirstTableDetail,
  clickListButtonAndVerifyListUrl,
  maybeSetupApiMockAndLogin,
} from '../cy-helpers';
import { entryPath, maybeSetupApiMockAndNatigateToEntriesList } from './entry-helpers';

function accessEntryDetail(type: EntryType): void {
  accessFirstTableDetail('entries-table', entryPath(type));
}

// jscpd:ignore-start
describe('Entry Detail Page', { testIsolation: false }, () => {
  before(() => {
    maybeSetupApiMockAndLogin();
  });

  [EntryType.CREDIT, EntryType.DEBIT, EntryType.TRANSFER].forEach((type) => {
    describe(`Type - ${type}`, () => {
      beforeEach(() => {
        maybeSetupApiMockAndNatigateToEntriesList(type);
      });
      //jscpd:ignore-end

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
