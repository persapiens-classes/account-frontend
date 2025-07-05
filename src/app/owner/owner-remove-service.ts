import { inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BeanRemoveService, removeBean } from '../bean/bean-remove-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OwnerRemoveService implements BeanRemoveService {
  private readonly http = inject(HttpClient);

  remove(id: string): Observable<void> {
    return removeBean(this.http, 'owners', id, '/');
  }
}

export const OWNER_REMOVE_SERVICE = new InjectionToken<OwnerRemoveService>('OwnerRemoveService');
