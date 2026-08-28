import { inject, Service, WritableSignal } from '@angular/core';
import { ModelListService, loadModels } from '../models/model-list-service';
import { AppMessageService } from '../app-message-service';
import { Balance } from './balance';
import { API_PATHS } from '../app.api-paths';

@Service()
export class BalanceListService implements ModelListService<Balance> {
  findAll(): WritableSignal<Balance[]> {
    return loadModels(inject(AppMessageService), 'Balance', API_PATHS.BALANCE_API_PATH);
  }
}
