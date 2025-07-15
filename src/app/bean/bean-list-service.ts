import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Bean, defaultJsonToBean, toBean } from './bean';
import { AppMessageService } from '../app-message-service';

export interface BeanListService<T extends Bean> {
  findAll(): Observable<T[]>;
}

export function findAllBeans<T extends Bean>(
  http: HttpClient,
  routerName: string,
  beanCreateFunction: () => T,
  jsonToBeanFunction: (t: T) => T = defaultJsonToBean,
): Observable<T[]> {
  const apiUrl = environment.apiUrl + '/' + routerName;
  return http
    .get<T[]>(apiUrl)
    .pipe(map((data) => data.map((bean) => toBean(bean, beanCreateFunction, jsonToBeanFunction))));
}

export function loadBeans<T extends Bean>(
  beanListService: BeanListService<T>,
  appMessageService: AppMessageService,
  beanName: string,
): Observable<T[]> {
  return beanListService.findAll().pipe(
    catchError((error) => {
      appMessageService.addErrorMessage(error, `${beanName} not listed`);
      return of();
    }),
  );
}
