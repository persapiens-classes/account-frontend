import { maybeSetupApiMockAndLogin } from '../cy-helpers';
import { accountDetailTests } from './account-detail';
import { accountEditTests } from './account-edit';
import { accountInsertTests } from './account-insert';
import { accountRemoveTests } from './account-remove';

describe('Account - Test Suite', { testIsolation: false }, () => {
  before(() => {
    maybeSetupApiMockAndLogin();
  });

  accountDetailTests();
  accountInsertTests();
  accountEditTests();
  accountRemoveTests();
});
