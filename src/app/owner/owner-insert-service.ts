import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Owner } from './owner';
import { ModelInsertService, insertModel } from '../models/model-insert-service';
import { Observable } from 'rxjs';

@Service()
export class OwnerInsertService implements ModelInsertService<Owner, Owner> {
  private readonly http = inject(HttpClient);

  insert(owner: Owner): Observable<Owner> {
    return insertModel(owner, this.http, 'owners');
  }
}
