import { inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { createOwner, Owner } from './owner';
import { BeanInsertService, insertBean } from '../bean/bean-insert-service';
import { defaultJsonToBean } from '../bean/bean';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OwnerInsertService implements BeanInsertService<Owner, Owner> {
  private readonly http = inject(HttpClient);

  insert(owner: Owner): Observable<Owner> {
    return insertBean(this.http, 'owners', createOwner, defaultJsonToBean, owner);
  }
}

export const OWNER_INSERT_SERVICE = new InjectionToken<OwnerInsertService>('OwnerInsertService');
