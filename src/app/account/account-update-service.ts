import { HttpClient } from '@angular/common/http';
import { Account, AccountType, createAccount } from './account';
import { BeanUpdateService, updateBean } from '../bean/bean-update-service';
import { Observable } from 'rxjs';

export class AccountUpdateService implements BeanUpdateService<Account, Account> {
  constructor(
    private readonly http: HttpClient,
    private readonly type: AccountType,
  ) {}

  update(id: string, account: Account): Observable<Account> {
    return updateBean(
      account,
      this.http,
      `${this.type.toLowerCase()}Accounts`,
      id,
      '/',
      createAccount,
    );
  }
}
