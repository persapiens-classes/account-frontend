import { maybeSetupApiMockAndLogin } from '../cy-helpers';

describe('Owner - Suite de Testes', { testIsolation: false }, () => {
  before(() => {
    maybeSetupApiMockAndLogin();
  });

  require('./owner-detail.ts');
  require('./owner-insert.ts');
  require('./owner-edit.ts');
  require('./owner-remove.ts');
});
