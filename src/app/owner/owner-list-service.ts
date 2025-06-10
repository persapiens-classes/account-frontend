import { Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { createOwner, Owner } from './owner';
import { BeanListService } from '../bean/bean-list-service';
import { defaultJsonToBean } from '../bean/bean';

@Injectable({
  providedIn: 'root',
})
export class OwnerListService extends BeanListService<Owner> {
  constructor(http: HttpClient) {
    super(http, 'owners', createOwner, defaultJsonToBean);
  }
}

export const OWNER_LIST_SERVICE = new InjectionToken<OwnerListService>('OwnerListService');
