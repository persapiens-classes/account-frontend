import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModelRemoveService, removeModel } from '../models/model-remove-service';
import { Observable } from 'rxjs';

@Service()
export class OwnerRemoveService implements ModelRemoveService {
  private readonly http = inject(HttpClient);

  remove(id: string): Observable<void> {
    return removeModel(this.http, 'owners', id, '/');
  }
}
