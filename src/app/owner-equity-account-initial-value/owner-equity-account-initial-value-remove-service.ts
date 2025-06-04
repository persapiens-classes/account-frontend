import { Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BeanRemoveService } from '../bean/bean-remove-service';

@Injectable({
  providedIn: 'root',
})
export class OwnerEquityAccountInitialValueRemoveService extends BeanRemoveService {
  constructor(http: HttpClient) {
    super(http, 'OwnerEquityAccountInitialValue', 'ownerEquityAccountInitialValues');
  }

  override idSeparator(): string {
    return '?';
  }
}

export const OWNER_EQUITY_ACCOUNT_INITIAL_VALUE_REMOVE_SERVICE =
  new InjectionToken<OwnerEquityAccountInitialValueRemoveService>(
    'OwnerEquityAccountInitialValueRemoveService',
  );
