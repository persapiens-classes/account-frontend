import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailFieldComponent } from '../field/detail-field.component';
import { Balance, BalanceSchema } from './balance';
import { BalanceFilterService } from './balance-filter-service';
import { firstValueFrom } from 'rxjs';
import { toModelFromHistory } from '../models/models';
import { ModelDetailPanelComponent } from '../models/model-detail-panel.component';
import { PATHS } from '../app.paths';
import {
  OwnerEquityAccountInitialValue,
  OwnerEquityAccountInitialValueSchema,
} from './owner-equity-account-initial-value';

@Component({
  selector: 'app-balance-detail',
  imports: [CommonModule, DetailFieldComponent, ModelDetailPanelComponent],
  template: `
    <app-model-detail-panel [routerName]="routerName" [model]="model">
      <app-detail-field strong="Owner" value="{{ model.owner }}" dataCy="detail-owner" />
      <app-detail-field
        strong="Equity Account"
        value="{{ model.equityAccount.description }} - {{ model.equityAccount.category }}"
      />
      <app-detail-field strong="Balance" value="{{ model.balance | number: '1.2-2' }}" />
      <app-detail-field strong="Initial Value" value="{{ model.initialValue | number: '1.2-2' }}" />
    </app-model-detail-panel>
  `,
})
export class BalanceDetailComponent implements OnInit {
  model: Balance;
  routerName = PATHS.BALANCE_PATH;
  private readonly balanceFilterService = inject(BalanceFilterService);
  constructor() {
    if (this.hasBalanceInHistory()) {
      this.model = toModelFromHistory<Balance>(BalanceSchema);
    } else {
      const modelFromHistory = toModelFromHistory<OwnerEquityAccountInitialValue>(
        OwnerEquityAccountInitialValueSchema,
      );
      this.model = {
        owner: modelFromHistory.owner,
        equityAccount: modelFromHistory.equityAccount,
        initialValue: modelFromHistory.initialValue,
        balance: 0,
      };
    }
  }

  ngOnInit(): void {
    this.initAsync();
  }

  hasBalanceInHistory() {
    return history.state?.model?.balance !== undefined;
  }

  private async initAsync(): Promise<void> {
    if (this.hasBalanceInHistory()) {
      this.model = await firstValueFrom(
        this.balanceFilterService.find(this.model.owner, this.model.equityAccount.description),
      );
    }
  }
}
