import { inject, Injectable, WritableSignal } from '@angular/core';
import { BeanListService, loadBeans } from '../bean/bean-list-service';
import { AppMessageService } from '../app-message-service';
import { Balance, createBalance } from './balance';

@Injectable({
  providedIn: 'root',
})
export class BalanceListService implements BeanListService<Balance> {
  findAll(): WritableSignal<Balance[]> {
    return loadBeans(inject(AppMessageService), 'Balance', 'balances', createBalance);
  }
}
