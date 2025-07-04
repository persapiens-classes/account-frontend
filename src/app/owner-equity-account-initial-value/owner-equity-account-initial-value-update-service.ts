import { inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  createOwnerEquityAccountInitialValue,
  OwnerEquityAccountInitialValue,
} from './owner-equity-account-initial-value';
import { BeanUpdateService } from '../bean/bean-update-service';
import { defaultJsonToBean } from '../bean/bean';

@Injectable({
  providedIn: 'root',
})
export class OwnerEquityAccountInitialValueUpdateService extends BeanUpdateService<
  OwnerEquityAccountInitialValue,
  number
> {
  constructor() {
    super(
      inject(HttpClient),
      'OwnerEquityAccountInitialValue',
      'ownerEquityAccountInitialValues',
      createOwnerEquityAccountInitialValue,
      defaultJsonToBean,
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
