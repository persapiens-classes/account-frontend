import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  OwnerEquityAccountInitialValue,
  OwnerEquityAccountInitialValueInsert,
} from './owner-equity-account-initial-value';
import { ModelInsertService, insertModel } from '../models/model-insert-service';
import { Observable } from 'rxjs';

@Service()
export class OwnerEquityAccountInitialValueInsertService implements ModelInsertService<
  OwnerEquityAccountInitialValue,
  OwnerEquityAccountInitialValueInsert
> {
  private readonly http = inject(HttpClient);

  insert(model: OwnerEquityAccountInitialValueInsert): Observable<OwnerEquityAccountInitialValue> {
    return insertModel(model, this.http, 'ownerEquityAccountInitialValues');
  }
}
