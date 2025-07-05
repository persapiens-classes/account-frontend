import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Bean, toBean } from './bean';

export interface BeanListService<T extends Bean> {
  findAll(): Observable<T[]>;
}

export function findAllBeans<T extends Bean>(
  http: HttpClient,
  routerName: string,
  beanCreateFunction: () => T,
  jsonToBeanFunction: (t: T) => T,
): Observable<T[]> {
  const apiUrl = environment.apiUrl + '/' + routerName;
  return http
    .get<T[]>(apiUrl)
    .pipe(map((data) => data.map((bean) => toBean(bean, beanCreateFunction, jsonToBeanFunction))));
}
