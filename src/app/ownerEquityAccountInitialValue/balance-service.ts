import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { environment } from '../../environments/environment';
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class BalanceService {

  private apiUrl;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl + '/balance';
  }

  find(owner: string, equityAccount: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}?owner=${owner}&equityAccount=${equityAccount}`).pipe(
      map(data => Number(data))
    )
  }
}
