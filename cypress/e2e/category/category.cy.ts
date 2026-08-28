import { maybeSetupApiMockAndLogin } from '../cy-helpers';
import { categoryDetailTests } from './category-detail';
import { categoryEditTests } from './category-edit';
import { categoryInsertTests } from './category-insert';
import { categoryRemoveTests } from './category-remove';

describe('Category - Test Suite', { testIsolation: false }, () => {
  before(() => {
    maybeSetupApiMockAndLogin();
  });

  categoryDetailTests();
  categoryInsertTests();
  categoryEditTests();
  categoryRemoveTests();
});
