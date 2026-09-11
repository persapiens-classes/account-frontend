import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailFieldComponent } from '../field/detail-field.component';
import { Balance } from './balance';
import { BalanceFilterService } from './balance-filter-service';
import { firstValueFrom } from 'rxjs';
import { ModelDetailPanelComponent } from '../models/model-detail-panel.component';
import { PATHS } from '../app.paths';
import {
  BalanceStateTransferService,
  OwnerEquityAccountInitialValueStateTransferService,
} from '../models/models-state-transfer-service';

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
    if (this.hasBalanceInStateTransferService()) {
      this.model = inject(BalanceStateTransferService).getState()!;
    } else {
      const ownerEquityAccountInitialValue = inject(
        OwnerEquityAccountInitialValueStateTransferService,
      ).getState()!;
      this.model = {
        owner: ownerEquityAccountInitialValue.owner,
        equityAccount: ownerEquityAccountInitialValue.equityAccount,
        initialValue: ownerEquityAccountInitialValue.initialValue,
        balance: 0,
      };
    }
  }

  ngOnInit(): void {
    this.initAsync();
  }

  hasBalanceInStateTransferService() {
    return inject(BalanceStateTransferService).getState();
  }

  private async initAsync(): Promise<void> {
    if (this.hasBalanceInStateTransferService()) {
      this.model = await firstValueFrom(
        this.balanceFilterService.find(this.model.owner, this.model.equityAccount.description),
      );
    }
  }
}
