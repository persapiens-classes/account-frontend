import { inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { createOwner, Owner } from './owner';
import { BeanListService, findAllBeans } from '../bean/bean-list-service';
import { defaultJsonToBean } from '../bean/bean';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OwnerListService implements BeanListService<Owner> {
  private readonly http = inject(HttpClient);

  findAll(): Observable<Owner[]> {
    return findAllBeans(this.http, 'owners', createOwner, defaultJsonToBean);
  }
}

export const OWNER_LIST_SERVICE = new InjectionToken<OwnerListService>('OwnerListService');
