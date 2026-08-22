import { HttpClient } from '@angular/common/http';
import { ModelInsertService, insertModel } from '../models/model-insert-service';
import { Account, AccountType } from './account';
import { Observable } from 'rxjs';
import { API_PATHS } from '../app.api-paths';

export class AccountInsertService implements ModelInsertService<Account, Account> {
  constructor(
    private readonly http: HttpClient,
    private readonly type: AccountType,
  ) {}

  insert(account: Account): Observable<Account> {
    return insertModel(
      account,
      this.http,
      `${this.type.toLowerCase()}${API_PATHS.ACCOUNT_API_PATH}`,
    );
  }
}
