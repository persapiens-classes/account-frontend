import { Injectable, InjectionToken } from '@angular/core';
import { BeanDetailService } from '../bean/bean-detail-service';

@Injectable({
  providedIn: 'root',
})
export class OwnerDetailService extends BeanDetailService {
  constructor() {
    super('owners');
  }
}

export const OWNER_DETAIL_SERVICE = new InjectionToken<OwnerDetailService>('OwnerDetailService');
