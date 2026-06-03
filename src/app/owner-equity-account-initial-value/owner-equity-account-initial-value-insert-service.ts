import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  createOwnerEquityAccountInitialValue,
  OwnerEquityAccountInitialValue,
  OwnerEquityAccountInitialValueInsert,
} from './owner-equity-account-initial-value';
import { BeanInsertService, insertBean } from '../bean/bean-insert-service';
import { Observable } from 'rxjs';

@Service()
export class OwnerEquityAccountInitialValueInsertService implements BeanInsertService<
  OwnerEquityAccountInitialValue,
  OwnerEquityAccountInitialValueInsert
> {
  private readonly http = inject(HttpClient);

  insert(bean: OwnerEquityAccountInitialValueInsert): Observable<OwnerEquityAccountInitialValue> {
    return insertBean(
      bean,
      this.http,
      'ownerEquityAccountInitialValues',
      createOwnerEquityAccountInitialValue,
    );
  }
}
