import { inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  createOwnerEquityAccountInitialValue,
  OwnerEquityAccountInitialValue,
  OwnerEquityAccountInitialValueInsert,
} from './owner-equity-account-initial-value';
import { BeanInsertService, insertBean } from '../bean/bean-insert-service';
import { defaultJsonToBean } from '../bean/bean';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OwnerEquityAccountInitialValueInsertService
  implements BeanInsertService<OwnerEquityAccountInitialValue, OwnerEquityAccountInitialValueInsert>
{
  private readonly http = inject(HttpClient);

  insert(bean: OwnerEquityAccountInitialValueInsert): Observable<OwnerEquityAccountInitialValue> {
    return insertBean(
      this.http,
      'ownerEquityAccountInitialValues',
      createOwnerEquityAccountInitialValue,
      defaultJsonToBean,
      bean,
    );
  }
}

export const OWNER_EQUITY_ACCOUNT_INITIAL_VALUE_INSERT_SERVICE =
  new InjectionToken<OwnerEquityAccountInitialValueInsertService>(
    'OwnerEquityAccountInitialValueInsertService',
  );
