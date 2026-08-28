import { maybeSetupApiMockAndLogin } from '../cy-helpers';
import { balanceDetailTests } from './balance-detail';

describe('Account - Test Suite', { testIsolation: false }, () => {
  before(() => {
    maybeSetupApiMockAndLogin();
  });

  balanceDetailTests();
});
