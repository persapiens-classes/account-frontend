import { inject, Service, WritableSignal } from '@angular/core';
import { Owner, OwnerSchema } from './owner';
import { ModelListService, findAllModels } from '../models/model-list-service';
import { AppMessageService } from '../app-message-service';
import { API_PATHS } from '../app.api-paths';

@Service()
export class OwnerListService implements ModelListService<Owner> {
  findAll(): WritableSignal<Owner[]> {
    return findAllModels(inject(AppMessageService), 'Owner', API_PATHS.OWNER_API_PATH, OwnerSchema);
  }
}
