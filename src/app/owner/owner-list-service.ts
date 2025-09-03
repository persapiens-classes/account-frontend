import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { createOwner, Owner } from './owner';
import {
  BeanArrayResource,
  BeanListService,
  findAllBeans,
  findAllBeansWithHttpResource,
} from '../bean/bean-list-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OwnerListService implements BeanListService<Owner> {
  private readonly http = inject(HttpClient);

  findAll(): Observable<Owner[]> {
    return findAllBeans(this.http, 'owners', createOwner);
  }

  findAllResource(): BeanArrayResource<Owner> {
    return findAllBeansWithHttpResource('owners', createOwner);
  }
}
