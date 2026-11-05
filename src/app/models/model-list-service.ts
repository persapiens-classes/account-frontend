import { HttpErrorResponse, httpResource, HttpResourceRef } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AppMessageService } from '../app-message-service';
import { effect, linkedSignal, WritableSignal } from '@angular/core';
import z, { ZodType } from 'zod';
import { safeModelWithZod } from './models';

export interface ModelListService<T> {
  findAll(): WritableSignal<T[]>;
}

function createHttpResource<T>(
  routerName: string,
  modelSchema: ZodType,
): HttpResourceRef<T[] | undefined> {
  const apiUrl = (_ctx: unknown) => `${environment.apiUrl}/${routerName}`;

  return httpResource<T[]>(apiUrl, {
    parse: (response: unknown) => {
      return safeModelWithZod(response, z.array(modelSchema)) as T[];
    },
  });
}

export function findAllModels<T>(
  appMessageService: AppMessageService,
  modelName: string,
  routerName: string,
  modelSchema: ZodType,
): WritableSignal<T[]> {
  const modelsResource = createHttpResource<T>(routerName, modelSchema);

  effect(() => {
    if (modelsResource.error()) {
      handleHttpResourceError(modelsResource.error(), appMessageService, modelName);
    }
  });

  return linkedSignal(() => (modelsResource.hasValue() ? modelsResource.value() : []));
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
