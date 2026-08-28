import { maybeSetupApiMockAndLogin } from '../cy-helpers';
import { entryDetailTests } from './entry-detail';
import { entryEditTests } from './entry-edit';
import { entryInsertTests } from './entry-insert';
import { entryRemoveTests } from './entry-remove';

describe('Entry - Test Suite', { testIsolation: false }, () => {
  before(() => {
    maybeSetupApiMockAndLogin();
  });

  entryDetailTests();
  entryInsertTests();
  entryEditTests();
  entryRemoveTests();
});
