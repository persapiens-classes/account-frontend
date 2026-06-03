import { inject, Service, WritableSignal } from '@angular/core';
import { createOwner, Owner } from './owner';
import { BeanListService, loadBeans } from '../bean/bean-list-service';
import { AppMessageService } from '../app-message-service';

@Service()
export class OwnerListService implements BeanListService<Owner> {
  findAll(): WritableSignal<Owner[]> {
    return loadBeans(inject(AppMessageService), 'Owner', 'owners', createOwner);
  }
}
