import { HttpClient } from '@angular/common/http';
import { BeanInsertService, insertBean } from '../bean/bean-insert-service';
import { Account, createAccount } from './account';
import { Observable } from 'rxjs';

export class AccountInsertService implements BeanInsertService<Account, Account> {
  constructor(
    private readonly http: HttpClient,
    private readonly type: string,
  ) {}

  insert(account: Account): Observable<Account> {
    return insertBean(account, this.http, `${this.type.toLowerCase()}Accounts`, createAccount);
  }
}
