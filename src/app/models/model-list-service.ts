import { HttpErrorResponse, httpResource, HttpResourceRef } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { defaultJsonToModel, toModel } from './models';
import { AppMessageService } from '../app-message-service';
import { effect, WritableSignal } from '@angular/core';

export interface ModelListService<T> {
  findAll(): WritableSignal<T[]>;
}

function findAllModels<T>(
  routerName: string,
  jsonToModelFunction: (t: T) => T = defaultJsonToModel,
): HttpResourceRef<T[]> {
  const apiUrl = () => `${environment.apiUrl}/${routerName}`;

  return httpResource<T[]>(apiUrl, {
    defaultValue: [],
    parse: (data: unknown) => {
      if (Array.isArray(data)) {
        return data.map((model) => toModel(model, jsonToModelFunction));
      }
      return [];
    },
  });
}

export function loadModels<T>(
  appMessageService: AppMessageService,
  modelName: string,
  routerName: string,
  jsonToModelFunction: (t: T) => T = defaultJsonToModel,
): WritableSignal<T[]> {
  const modelsResource = findAllModels(routerName, jsonToModelFunction);

  effect(() => {
    if (modelsResource.error()) {
      handleHttpResourceError(modelsResource.error(), appMessageService, modelName);
    }
  });

  return modelsResource.value;
}

export function handleHttpResourceError(
  error: unknown,
  appMessageService: AppMessageService,
  modelName: string,
): void {
  if (error instanceof HttpErrorResponse) {
    appMessageService.addErrorMessage(error, `${modelName} not listed`);
  } else if (error instanceof Error) {
    // generic JS error
    appMessageService.addErrorMessage(
      new HttpErrorResponse({ error, status: 0, statusText: error.message }),
      `${modelName} not listed`,
    );
  } else {
    // fallback to anything (string, unknown object, etc.)
    appMessageService.addErrorMessage(
      new HttpErrorResponse({
        error: error instanceof Error ? error.message : JSON.stringify(error),
        status: 0,
        statusText: 'Unknown error',
      }),
      `${modelName} not listed`,
    );
  }
}
