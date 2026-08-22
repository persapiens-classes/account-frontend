import { Account, AccountType } from './account';
import { ModelListService, loadModels } from '../models/model-list-service';
import { WritableSignal } from '@angular/core';
import { AppMessageService } from '../app-message-service';
import { API_PATHS } from '../app.api-paths';

export class AccountListService implements ModelListService<Account> {
  constructor(
    private readonly appMessageService: AppMessageService,
    private readonly type: AccountType,
  ) {}

  findAll(): WritableSignal<Account[]> {
    return loadModels(
      this.appMessageService,
      `${this.type} Account`,
      `${this.type.toLowerCase()}${API_PATHS.ACCOUNT_API_PATH}`,
    );
  }
}
