import { Injectable, InjectionToken } from '@angular/core';
import { BeanDetailService } from '../bean/bean-detail-service';

@Injectable({
  providedIn: 'root',
})
export class BalanceDetailService extends BeanDetailService {
  constructor() {
    super('balances');
  }
}

export const BALANCE_DETAIL_SERVICE = new InjectionToken<BalanceDetailService>(
  'BalanceDetailService',
);
