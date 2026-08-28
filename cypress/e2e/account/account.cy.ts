import { maybeSetupApiMockAndLogin } from '../cy-helpers';

describe('Account - Suite de Testes', { testIsolation: false }, () => {
  before(() => {
    maybeSetupApiMockAndLogin();
  });

  require('./account-detail.ts');
  require('./account-insert.ts');
  require('./account-edit.ts');
  require('./account-remove.ts');
});
