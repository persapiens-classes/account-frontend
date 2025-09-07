import { Account, createAccount } from './account';
import { BeanListService, loadBeans } from '../bean/bean-list-service';
import { WritableSignal } from '@angular/core';
import { AppMessageService } from '../app-message-service';

export class AccountListService implements BeanListService<Account> {
  constructor(
    private readonly appMessageService: AppMessageService,
    private readonly type: string,
  ) {}

  findAll(): WritableSignal<Account[]> {
    return loadBeans(
      this.appMessageService,
      `${this.type} Account`,
      `${this.type.toLowerCase()}Accounts`,
      createAccount,
    );
  }
}
