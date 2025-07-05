import { inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { createOwner, Owner } from './owner';
import { BeanUpdateService, updateBean } from '../bean/bean-update-service';
import { defaultJsonToBean } from '../bean/bean';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OwnerUpdateService implements BeanUpdateService<Owner, Owner> {
  private readonly http = inject(HttpClient);

  update(id: string, owner: Owner): Observable<Owner> {
    return updateBean(this.http, 'owners', createOwner, defaultJsonToBean, id, '/', owner);
  }
}

export const OWNER_UPDATE_SERVICE = new InjectionToken<OwnerUpdateService>('OwnerUpdateService');
