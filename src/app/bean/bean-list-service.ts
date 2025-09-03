import { HttpClient, HttpErrorResponse, httpResource, HttpResourceRef } from '@angular/common/http';
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

export type BeanArrayResource<T extends Bean> = HttpResourceRef<T[]>;

export function findAllBeansWithHttpResource<T extends Bean>(
  routerName: string,
  beanCreateFunction: () => T,
  jsonToBeanFunction: (t: T) => T = defaultJsonToBean,
): BeanArrayResource<T> {
  const apiUrl = () => `${environment.apiUrl}/${routerName}`;

  return httpResource<T[]>(apiUrl, {
    defaultValue: [],
    parse: (data: unknown) => {
      if (Array.isArray(data)) {
        return data.map((bean) => toBean(bean, beanCreateFunction, jsonToBeanFunction));
      }
      return [];
    },
  }) as unknown as BeanArrayResource<T>;
}

export async function loadBeansWithHttpResource<T extends Bean>(
  beansResource: ReturnType<typeof findAllBeansWithHttpResource<T>>,
  appMessageService: AppMessageService,
  beanName: string,
): Promise<T[]> {
  try {
    return beansResource.value();
  } catch (error) {
    handleHttpResourceError(error, appMessageService, beanName);
    return [];
  }
}

export function handleHttpResourceError(
  error: unknown,
  appMessageService: AppMessageService,
  beanName: string,
): void {
  if (error instanceof HttpErrorResponse) {
    appMessageService.addErrorMessage(error, `${beanName} not listed`);
  } else if (error instanceof Error) {
    // erro genérico do JS
    appMessageService.addErrorMessage(
      new HttpErrorResponse({ error, status: 0, statusText: error.message }),
      `${beanName} not listed`,
    );
  } else {
    // fallback para qualquer coisa (string, objeto desconhecido etc.)
    appMessageService.addErrorMessage(
      new HttpErrorResponse({ error: String(error), status: 0, statusText: 'Unknown error' }),
      `${beanName} not listed`,
    );
  }
}
