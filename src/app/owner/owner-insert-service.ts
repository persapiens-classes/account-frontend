import { inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { createOwner, Owner } from './owner';
import { BeanInsertService } from '../bean/bean-insert-service';
import { defaultJsonToBean } from '../bean/bean';

@Injectable({
  providedIn: 'root',
})
export class OwnerInsertService extends BeanInsertService<Owner, Owner> {
  constructor() {
    super(inject(HttpClient), 'Owner', 'owners', createOwner, defaultJsonToBean);
  }
}

export const OWNER_INSERT_SERVICE = new InjectionToken<OwnerInsertService>('OwnerInsertService');
