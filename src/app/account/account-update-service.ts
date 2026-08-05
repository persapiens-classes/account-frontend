import { HttpClient } from '@angular/common/http';
import { Account, AccountType } from './account';
import { ModelUpdateService, updateModel } from '../models/model-update-service';
import { Observable } from 'rxjs';

export class AccountUpdateService implements ModelUpdateService<Account, Account> {
  constructor(
    private readonly http: HttpClient,
    private readonly type: AccountType,
  ) {}

  update(id: string, account: Account): Observable<Account> {
    return updateModel(account, this.http, `${this.type.toLowerCase()}Accounts`, id, '/');
  }
}
