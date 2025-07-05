import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { Balance, createBalance } from './balance';
import { BeanListService, findAllBeans } from '../bean/bean-list-service';
import { defaultJsonToBean } from '../bean/bean';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BalanceListService implements BeanListService<Balance> {
  private readonly http = inject(HttpClient);

  findAll(): Observable<Balance[]> {
    return findAllBeans(this.http, 'balances', createBalance, defaultJsonToBean);
  }
}

export const BALANCE_LIST_SERVICE = new InjectionToken<BalanceListService>('BalanceListService');
