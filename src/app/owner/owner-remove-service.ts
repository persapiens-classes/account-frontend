import { inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BeanRemoveService } from '../bean/bean-remove-service';

@Injectable({
  providedIn: 'root',
})
export class OwnerRemoveService extends BeanRemoveService {
  constructor() {
    super(inject(HttpClient), 'Owner', 'owners');
  }
}

export const OWNER_REMOVE_SERVICE = new InjectionToken<OwnerRemoveService>('OwnerRemoveService');
