import { HttpErrorResponse, httpResource, HttpResourceRef } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AppMessageService } from '../app-message-service';
import { effect, WritableSignal } from '@angular/core';

export interface ModelListService<T> {
  findAll(): WritableSignal<T[]>;
}

function findAllModels<T>(routerName: string): HttpResourceRef<T[]> {
  const apiUrl = () => `${environment.apiUrl}/${routerName}`;

  return httpResource<T[]>(apiUrl, {
    defaultValue: [],
  });
}

export function loadModels<T>(
  appMessageService: AppMessageService,
  modelName: string,
  routerName: string,
): WritableSignal<T[]> {
  const modelsResource = findAllModels<T>(routerName);

  effect(() => {
    if (modelsResource.error()) {
      handleHttpResourceError(modelsResource.error(), appMessageService, modelName);
    }
  });

  return modelsResource.value;
}

function handleHttpResourceError(
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
