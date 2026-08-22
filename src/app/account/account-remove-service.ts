import { HttpClient } from '@angular/common/http';
import { ModelRemoveService, removeModel } from '../models/model-remove-service';
import { Observable } from 'rxjs';
import { AccountType } from './account';
import { API_PATHS } from '../app.api-paths';

export class AccountRemoveService implements ModelRemoveService {
  constructor(
    private readonly http: HttpClient,
    private readonly type: AccountType,
  ) {}

  remove(id: string): Observable<void> {
    return removeModel(
      this.http,
      `${this.type.toLowerCase()}${API_PATHS.ACCOUNT_API_PATH}`,
      id,
      '/',
    );
  }
}
