import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { createOwner, Owner } from './owner';
import { BeanInsertService, insertBean } from '../bean/bean-insert-service';
import { Observable } from 'rxjs';

@Service()
export class OwnerInsertService implements BeanInsertService<Owner, Owner> {
  private readonly http = inject(HttpClient);

  insert(owner: Owner): Observable<Owner> {
    return insertBean(owner, this.http, 'owners', createOwner);
  }
}
