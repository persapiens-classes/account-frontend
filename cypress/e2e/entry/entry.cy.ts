import { maybeSetupApiMockAndLogin } from '../cy-helpers';

describe('Entry - Test Suite', { testIsolation: false }, () => {
  before(() => {
    maybeSetupApiMockAndLogin();
  });

  require('./entry-detail.ts');
  require('./entry-insert.ts');
  require('./entry-remove.ts');
});
