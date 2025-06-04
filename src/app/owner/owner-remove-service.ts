import { Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Owner } from './owner';
import { BeanRemoveService } from '../bean/bean-remove-service';

@Injectable({
  providedIn: 'root',
})
export class OwnerRemoveService extends BeanRemoveService<Owner> {
  constructor(http: HttpClient) {
    super(http, 'Owner', 'owners');
  }
}

export const OWNER_REMOVE_SERVICE = new InjectionToken<OwnerRemoveService>('OwnerRemoveService');
