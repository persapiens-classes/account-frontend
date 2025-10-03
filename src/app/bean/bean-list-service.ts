import { HttpErrorResponse, httpResource, HttpResourceRef } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Bean, defaultJsonToBean, toBean } from './bean';
import { AppMessageService } from '../app-message-service';
import { effect, WritableSignal } from '@angular/core';

export interface BeanListService<T extends Bean> {
  findAll(): WritableSignal<T[]>;
}

export type BeanArrayResource<T extends Bean> = HttpResourceRef<T[]>;

export function findAllBeans<T extends Bean>(
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

export function loadBeans<T extends Bean>(
  appMessageService: AppMessageService,
  beanName: string,
  routerName: string,
  beanCreateFunction: () => T,
  jsonToBeanFunction: (t: T) => T = defaultJsonToBean,
): WritableSignal<T[]> {
  const beansResource = findAllBeans(routerName, beanCreateFunction, jsonToBeanFunction);

  effect(() => {
    if (beansResource.error()) {
      handleHttpResourceError(beansResource.error(), appMessageService, beanName);
    }
  });

  return beansResource.value;
}

export function handleHttpResourceError(
  error: unknown,
  appMessageService: AppMessageService,
  beanName: string,
): void {
  if (error instanceof HttpErrorResponse) {
    appMessageService.addErrorMessage(error, `${beanName} not listed`);
  } else if (error instanceof Error) {
    // generic JS error
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
