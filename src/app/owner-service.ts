import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Owner } from "./owner";
import { Observable } from "rxjs";
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

  private apiUrl = environment.apiUrl + '/owners';

  constructor(private http: HttpClient) {
  }

  insert(bean: Owner): Observable<Owner> {
    return this.http.post<Owner>(this.apiUrl, bean)
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }

  update(id: string, bean: Owner): Observable<Owner> {
    return this.http.put<Owner>(`${this.apiUrl}/${id}`, bean)
  }

  findAll(): Observable<Array<Owner>> {
    return this.http.get<Array<Owner>>(this.apiUrl)
  }

  findById(id: string): Observable<Owner> {
    return this.http.get<Owner>(`${this.apiUrl}/${id}`)
  }
}
