import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { createOwner, Owner } from './owner';
import { BeanUpdateService, updateBean } from '../bean/bean-update-service';
import { Observable } from 'rxjs';

@Service()
export class OwnerUpdateService implements BeanUpdateService<Owner, Owner> {
  private readonly http = inject(HttpClient);

  update(id: string, owner: Owner): Observable<Owner> {
    return updateBean(owner, this.http, 'owners', id, '/', createOwner);
  }
}
