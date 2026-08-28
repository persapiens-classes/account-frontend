import { EntryType } from '../../../src/app/entry/entry';
import { entriesDefault } from '../../support/fakers/models-default';
import {
  clickRemoveButtonAndConfirRemoval as clickRemoveButtonAndConfirmRemoval,
  maybeSetupApiMockAndLogin,
} from '../cy-helpers';
import {
  entryPath,
  goToEntryListAndFilterEntryDescriptionAndClickButton as goToEntryListAndFilterEntryInOwnerAndClickButton,
} from './entry-helpers';

describe('Entry Remove Page', { testIsolation: false }, () => {
  before(() => {
    maybeSetupApiMockAndLogin();
  });

  [EntryType.CREDIT, EntryType.DEBIT, EntryType.TRANSFER].forEach((type) => {
    describe(`Type - ${type}`, () => {
      beforeEach(() => {
        cy.maybeSetupApiMock();
      });

      it('should remove the recently created Entry successfully', () => {
        const validEntry = entriesDefault(type).at(0)!;

        cy.navigateToEntryNew(type);

        // select validEntry and click delete button
        goToEntryListAndFilterEntryInOwnerAndClickButton(type, validEntry.inOwner, 'delete');

        clickRemoveButtonAndConfirmRemoval('entries-table-row', entryPath(type));
      });
    });
  });
});
