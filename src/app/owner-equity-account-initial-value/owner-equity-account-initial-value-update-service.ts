import { Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  OwnerEquityAccountInitialValue,
  OwnerEquityAccountInitialValueInsert,
} from './owner-equity-account-initial-value';
import { OwnerEquityAccountInitialValueCreateService } from './owner-equity-account-initial-value-create-service';
import { BeanUpdateService } from '../bean/bean-update-service';

@Injectable({
  providedIn: 'root',
})
export class OwnerEquityAccountInitialValueUpdateService extends BeanUpdateService<
  OwnerEquityAccountInitialValue,
  number
> {
  constructor(http: HttpClient) {
    super(
      http,
      'OwnerEquityAccountInitialValue',
      'ownerEquityAccountInitialValues',
      new OwnerEquityAccountInitialValueCreateService(),
    );
  }

  override idSeparator(): string {
    return '?';
  }
}

export const OWNER_EQUITY_ACCOUNT_INITIAL_VALUE_UPDATE_SERVICE =
  new InjectionToken<OwnerEquityAccountInitialValueUpdateService>(
    'OwnerEquityAccountInitialValueUpdateService',
  );
