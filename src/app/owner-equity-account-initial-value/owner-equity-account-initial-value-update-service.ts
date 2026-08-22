import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OwnerEquityAccountInitialValue } from './owner-equity-account-initial-value';
import { ModelUpdateService, updateModel } from '../models/model-update-service';
import { Observable } from 'rxjs';
import { API_PATHS } from '../app.api-paths';

@Service()
export class OwnerEquityAccountInitialValueUpdateService implements ModelUpdateService<
  OwnerEquityAccountInitialValue,
  number
> {
  private readonly http = inject(HttpClient);

  update(id: string, numberToUpdate: number): Observable<OwnerEquityAccountInitialValue> {
    return updateModel(
      numberToUpdate,
      this.http,
      API_PATHS.OWNER_EQUITY_ACCOUNT_INITIAL_VALUE_API_PATH,
      id,
      '?',
    );
  }
}
