import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Balance } from './balance';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BalanceFilterService {
  private apiUrl;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl + '/balances/filter';
  }

  find(owner: string, equityAccount: string): Observable<Balance> {
    return this.http.get<Balance>(`${this.apiUrl}?owner=${owner}&equityAccount=${equityAccount}`);
  }
}
