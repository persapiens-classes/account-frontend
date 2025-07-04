import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { Balance, createBalance } from './balance';
import { BeanListService } from '../bean/bean-list-service';
import { defaultJsonToBean } from '../bean/bean';

@Injectable({
  providedIn: 'root',
})
export class BalanceListService extends BeanListService<Balance> {
  constructor() {
    super(inject(HttpClient), 'balances', createBalance, defaultJsonToBean);
  }
}

export const BALANCE_LIST_SERVICE = new InjectionToken<BalanceListService>('BalanceListService');
