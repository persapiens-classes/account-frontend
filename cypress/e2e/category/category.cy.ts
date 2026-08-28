import { maybeSetupApiMockAndLogin } from '../cy-helpers';

describe('Category - Suite de Testes', { testIsolation: false }, () => {
  before(() => {
    maybeSetupApiMockAndLogin();
  });

  require('./category-detail.ts');
  require('./category-insert.ts');
  require('./category-edit.ts');
  require('./category-remove.ts');
});
