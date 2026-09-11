import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Balance, BalanceSchema } from './balance';
import { inject, Service } from '@angular/core';
import { API_PATHS } from '../app.api-paths';
import { safeModelWithZod } from '../models/models';

@Service()
export class BalanceFilterService {
  private readonly apiUrl = `${environment.apiUrl}/${API_PATHS.BALANCE_API_PATH}/filter`;

  private readonly http = inject(HttpClient);

  find(owner: string, equityAccount: string): Observable<Balance> {
    return this.http
      .get<Balance>(`${this.apiUrl}?owner=${owner}&equityAccount=${equityAccount}`)
      .pipe(map((response) => safeModelWithZod(response, BalanceSchema)));
  }
}
