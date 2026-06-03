import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  createOwnerEquityAccountInitialValue,
  OwnerEquityAccountInitialValue,
} from './owner-equity-account-initial-value';
import { BeanUpdateService, updateBean } from '../bean/bean-update-service';
import { Observable } from 'rxjs';

@Service()
export class OwnerEquityAccountInitialValueUpdateService implements BeanUpdateService<
  OwnerEquityAccountInitialValue,
  number
> {
  private readonly http = inject(HttpClient);

  update(id: string, numberToUpdate: number): Observable<OwnerEquityAccountInitialValue> {
    return updateBean(
      numberToUpdate,
      this.http,
      'ownerEquityAccountInitialValues',
      id,
      '?',
      createOwnerEquityAccountInitialValue,
    );
  }
}
