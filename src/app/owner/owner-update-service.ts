import { Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Owner } from './owner';
import { BeanUpdateService } from '../bean/bean-update-service';
import { OwnerCreateService } from './owner-create-service';

@Injectable({
  providedIn: 'root',
})
export class OwnerUpdateService extends BeanUpdateService<Owner, Owner> {
  constructor(http: HttpClient) {
    super(http, 'Owner', 'owners', new OwnerCreateService());
  }
}

export const OWNER_UPDATE_SERVICE = new InjectionToken<OwnerUpdateService>('OwnerUpdateService');
