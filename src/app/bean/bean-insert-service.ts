import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Bean, defaultJsonToBean, toBean } from './bean';

export interface BeanInsertService<T extends Bean, I> {
  insert(bean: I): Observable<T>;
}

export function insertBean<T extends Bean, I>(
  bean: I,
  http: HttpClient,
  routerName: string,
  beanCreateFunction: () => T,
  jsonToBeanFunction: (t: T) => T = defaultJsonToBean,
): Observable<T> {
  const apiUrl = environment.apiUrl + '/' + routerName;
  return http
    .post<T>(apiUrl, bean)
    .pipe(map((data) => toBean(data, beanCreateFunction, jsonToBeanFunction)));
}
