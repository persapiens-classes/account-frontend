import { inject, Service, WritableSignal } from '@angular/core';
import { ModelListService, loadModels } from '../models/model-list-service';
import { AppMessageService } from '../app-message-service';
import { Balance } from './balance';

@Service()
export class BalanceListService implements ModelListService<Balance> {
  findAll(): WritableSignal<Balance[]> {
    return loadModels(inject(AppMessageService), 'Balance', 'balances');
  }
}
