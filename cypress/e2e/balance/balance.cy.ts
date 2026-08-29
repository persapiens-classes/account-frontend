import { maybeSetupApiMockAndLogin } from '../cy-helpers';
import { balanceDetailTests } from './balance-detail';
import { balanceInsertTests } from './balance-insert';

describe('Balance - Test Suite', { testIsolation: false }, () => {
  before(() => {
    maybeSetupApiMockAndLogin();
  });

  balanceDetailTests();
  balanceInsertTests();
});
