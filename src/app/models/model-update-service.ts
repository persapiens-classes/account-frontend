import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { defaultJsonToModel, toModel } from './models';

export interface ModelUpdateService<T, U> {
  update(id: string, model: U): Observable<T>;
}

export function updateModel<T, U>(
  model: U,
  http: HttpClient,
  routerName: string,
  id: string,
  idSeparator: string,
  jsonToModelFunction: (t: T) => T = defaultJsonToModel,
): Observable<T> {
  const apiUrl = environment.apiUrl + '/' + routerName;
  return http
    .put<T>(`${apiUrl}${idSeparator}${id}`, model)
    .pipe(map((data) => toModel(data, jsonToModelFunction)));
}
