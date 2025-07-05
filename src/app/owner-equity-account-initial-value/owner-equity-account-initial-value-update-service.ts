import { inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  createOwnerEquityAccountInitialValue,
  OwnerEquityAccountInitialValue,
} from './owner-equity-account-initial-value';
import { BeanUpdateService, updateBean } from '../bean/bean-update-service';
import { defaultJsonToBean } from '../bean/bean';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OwnerEquityAccountInitialValueUpdateService
  implements BeanUpdateService<OwnerEquityAccountInitialValue, number>
{
  private readonly http = inject(HttpClient);

  update(id: string, numberToUpdate: number): Observable<OwnerEquityAccountInitialValue> {
    return updateBean(
      this.http,
      'ownerEquityAccountInitialValues',
      createOwnerEquityAccountInitialValue,
      defaultJsonToBean,
      id,
      '?',
      numberToUpdate,
    );
  }
}

export const OWNER_EQUITY_ACCOUNT_INITIAL_VALUE_UPDATE_SERVICE =
  new InjectionToken<OwnerEquityAccountInitialValueUpdateService>(
    'OwnerEquityAccountInitialValueUpdateService',
  );
