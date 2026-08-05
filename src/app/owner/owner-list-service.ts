import { inject, Service, WritableSignal } from '@angular/core';
import { Owner } from './owner';
import { ModelListService, loadModels } from '../models/model-list-service';
import { AppMessageService } from '../app-message-service';

@Service()
export class OwnerListService implements ModelListService<Owner> {
  findAll(): WritableSignal<Owner[]> {
    return loadModels(inject(AppMessageService), 'Owner', 'owners');
  }
}
