/// <reference types="cypress" />

import { Owner } from '../../../src/app/owner/owner';
import { ModelCrudApiMock, validate } from './model-crud-api-mock';
import { API_PATHS } from '../../../src/app/app.api-paths';
import { ownersDefault } from '../fakers/models-default';

export function ownerApiMock(): ModelCrudApiMock<Owner, Owner, Owner, string> {
  const ownersEndpoint = `/${API_PATHS.OWNER_API_PATH}`;

  const idFn = (model: Owner): string => model.name;

  const validateFn = (owner: Owner | undefined): string | null => {
    return validate('Owner name', owner?.name);
  };

  const owners = ownersDefault();

  return new ModelCrudApiMock<Owner, Owner, Owner, string>({
    endpoint: ownersEndpoint,
    idFn: idFn,
    models: owners,
    postValidateFn: validateFn,
    putValidateFn: validateFn,
  });
}
