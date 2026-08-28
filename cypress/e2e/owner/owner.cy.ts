import { maybeSetupApiMockAndLogin } from '../cy-helpers';
import { ownerDetailTests } from './owner-detail';
import { ownerEditTests } from './owner-edit';
import { ownerInsertTests } from './owner-insert';
import { ownerRemoveTests } from './owner-remove';

describe('Owner - Test Suite', { testIsolation: false }, () => {
  before(() => {
    maybeSetupApiMockAndLogin();
  });

  ownerDetailTests();
  ownerInsertTests();
  ownerEditTests();
  ownerRemoveTests();
});
