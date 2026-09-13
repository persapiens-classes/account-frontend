import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ZodType } from 'zod';
import { safeModelWithZod } from './models';

export interface ModelUpdateService<T, U> {
  update(id: string, model: U): Observable<T>;
}

export function updateModel<T, U>(
  model: U,
  http: HttpClient,
  routerName: string,
  id: string,
  idSeparator: string,
  modelSchema: ZodType,
): Observable<T> {
  const apiUrl = `${environment.apiUrl}/${routerName}`;
  return http
    .put<T>(`${apiUrl}${idSeparator}${id}`, model)
    .pipe(map((response) => safeModelWithZod(response, modelSchema) as T));
}
