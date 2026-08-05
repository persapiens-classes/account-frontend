import { HttpClient } from '@angular/common/http';
import { ModelRemoveService, removeModel } from '../models/model-remove-service';
import { Observable } from 'rxjs';
import { AccountType } from './account';

export class AccountRemoveService implements ModelRemoveService {
  constructor(
    private readonly http: HttpClient,
    private readonly type: AccountType,
  ) {}

  remove(id: string): Observable<void> {
    return removeModel(this.http, `${this.type.toLowerCase()}Accounts`, id, '/');
  }
}
