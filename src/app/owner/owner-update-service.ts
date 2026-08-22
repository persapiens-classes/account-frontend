import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Owner } from './owner';
import { ModelUpdateService, updateModel } from '../models/model-update-service';
import { Observable } from 'rxjs';
import { API_PATHS } from '../app.api-paths';

@Service()
export class OwnerUpdateService implements ModelUpdateService<Owner, Owner> {
  private readonly http = inject(HttpClient);

  update(id: string, owner: Owner): Observable<Owner> {
    return updateModel(owner, this.http, API_PATHS.OWNER_API_PATH, id, '/');
  }
}
