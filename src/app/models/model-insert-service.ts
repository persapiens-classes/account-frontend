import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { defaultJsonToModel, toModel } from './models';

export interface ModelInsertService<T, I> {
  insert(model: I): Observable<T>;
}

export function insertModel<T, I>(
  model: I,
  http: HttpClient,
  routerName: string,
  jsonToModelFunction: (t: T) => T = defaultJsonToModel,
): Observable<T> {
  const apiUrl = environment.apiUrl + '/' + routerName;
  return http.post<T>(apiUrl, model).pipe(map((data) => toModel(data, jsonToModelFunction)));
}
