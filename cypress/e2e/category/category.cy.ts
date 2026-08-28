import { maybeSetupApiMockAndLogin } from '../cy-helpers';

describe('Category - Test Suite', { testIsolation: false }, () => {
  before(() => {
    maybeSetupApiMockAndLogin();
  });

  require('./category-detail.ts');
  require('./category-insert.ts');
  require('./category-edit.ts');
  require('./category-remove.ts');
});
