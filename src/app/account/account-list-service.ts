import { HttpClient } from '@angular/common/http';
import { Account, createAccount } from './account';
import { BeanListService, findAllBeans } from '../bean/bean-list-service';
import { Observable } from 'rxjs';

export class AccountListService implements BeanListService<Account> {
  constructor(
    private readonly http: HttpClient,
    private readonly type: string,
  ) {}

  findAll(): Observable<Account[]> {
    return findAllBeans(this.http, `${this.type.toLowerCase()}Accounts`, createAccount);
  }
}
