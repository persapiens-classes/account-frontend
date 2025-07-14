import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Bean, defaultJsonToBean, toBean } from './bean';

export interface BeanUpdateService<T extends Bean, U> {
  update(id: string, bean: U): Observable<T>;
}

export function updateBean<T extends Bean, U>(
  bean: U,
  http: HttpClient,
  routerName: string,
  id: string,
  idSeparator: string,
  beanCreateFunction: () => T,
  jsonToBeanFunction: (t: T) => T = defaultJsonToBean,
): Observable<T> {
  const apiUrl = environment.apiUrl + '/' + routerName;
  return http
    .put<T>(`${apiUrl}${idSeparator}${id}`, bean)
    .pipe(map((data) => toBean(data, beanCreateFunction, jsonToBeanFunction)));
}
