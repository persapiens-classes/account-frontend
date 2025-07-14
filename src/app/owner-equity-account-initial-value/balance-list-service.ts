import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Balance, createBalance } from './balance';
import { BeanListService, findAllBeans } from '../bean/bean-list-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BalanceListService implements BeanListService<Balance> {
  private readonly http = inject(HttpClient);

  findAll(): Observable<Balance[]> {
    return findAllBeans(this.http, 'balances', createBalance);
  }
}
