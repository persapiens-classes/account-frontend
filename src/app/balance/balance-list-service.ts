import { inject, Service, WritableSignal } from '@angular/core';
import { ModelListService, findAllModels } from '../models/model-list-service';
import { AppMessageService } from '../app-message-service';
import { Balance, BalanceSchema } from './balance';
import { API_PATHS } from '../app.api-paths';

@Service()
export class BalanceListService implements ModelListService<Balance> {
  findAll(): WritableSignal<Balance[]> {
    return findAllModels(
      inject(AppMessageService),
      'Balance',
      API_PATHS.BALANCE_API_PATH,
      BalanceSchema,
    );
  }
}
