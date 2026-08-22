import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModelRemoveService, removeModel } from '../models/model-remove-service';
import { Observable } from 'rxjs';
import { API_PATHS } from '../app.api-paths';

@Service()
export class OwnerRemoveService implements ModelRemoveService {
  private readonly http = inject(HttpClient);

  remove(id: string): Observable<void> {
    return removeModel(this.http, API_PATHS.OWNER_API_PATH, id, '/');
  }
}
