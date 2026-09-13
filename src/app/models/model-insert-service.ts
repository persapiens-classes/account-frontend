import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ZodType } from 'zod';
import { safeModelWithZod } from './models';

export interface ModelInsertService<T, I> {
  insert(model: I): Observable<T>;
}

export function insertModel<T, I>(
  model: I,
  http: HttpClient,
  routerName: string,
  modelSchema: ZodType,
): Observable<T> {
  const apiUrl = `${environment.apiUrl}/${routerName}`;
  return http
    .post<T>(apiUrl, model)
    .pipe(map((response) => safeModelWithZod(response, modelSchema) as T));
}
