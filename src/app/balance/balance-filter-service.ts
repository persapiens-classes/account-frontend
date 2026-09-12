import { httpResource } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Balance, BalanceSchema } from './balance';
import { Service, WritableSignal } from '@angular/core';
import { API_PATHS } from '../app.api-paths';
import { safeModelWithZod } from '../models/models';

@Service()
export class BalanceFilterService {
  private readonly apiUrl = `${environment.apiUrl}/${API_PATHS.BALANCE_API_PATH}/filter`;

  find(owner: string, equityAccount: string): WritableSignal<Balance | undefined> {
    return httpResource<Balance>(
      (_ctx: unknown) => `${this.apiUrl}?owner=${owner}&equityAccount=${equityAccount}`,
      {
        defaultValue: {
          balance: 0,
          initialValue: 0,
          owner,
          equityAccount: { description: equityAccount, category: '' },
        },
        parse: (response: unknown) => safeModelWithZod(response, BalanceSchema),
      },
    ).value;
  }
}
