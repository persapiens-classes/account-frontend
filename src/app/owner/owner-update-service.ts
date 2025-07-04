import { inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { createOwner, Owner } from './owner';
import { BeanUpdateService } from '../bean/bean-update-service';
import { defaultJsonToBean } from '../bean/bean';

@Injectable({
  providedIn: 'root',
})
export class OwnerUpdateService extends BeanUpdateService<Owner, Owner> {
  constructor() {
    super(inject(HttpClient), 'Owner', 'owners', createOwner, defaultJsonToBean);
  }
}

export const OWNER_UPDATE_SERVICE = new InjectionToken<OwnerUpdateService>('OwnerUpdateService');
