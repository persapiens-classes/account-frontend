import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailFieldComponent } from '../field/detail-field.component';
import { BalanceFilterService } from './balance-filter-service';
import { Balance } from './balance';
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
    <app-model-detail-panel
      [routerName]="routerName"
      [model]="model()"
      [stateTransferService]="balanceStateTransferService"
    >
      <app-detail-field strong="Owner" value="{{ model().owner }}" dataCy="detail-owner" />
      <app-detail-field
        strong="Equity Account"
        value="{{ model().equityAccount.description }} - {{ model().equityAccount.category }}"
      />
      <app-detail-field strong="Balance" value="{{ model().balance | number: '1.2-2' }}" />
      <app-detail-field
        strong="Initial Value"
        value="{{ model().initialValue | number: '1.2-2' }}"
      />
    </app-model-detail-panel>
  `,
})
export class BalanceDetailComponent {
  routerName = PATHS.BALANCE_PATH;
  private readonly balanceFilterService = inject(BalanceFilterService);
  balanceStateTransferService = inject(BalanceStateTransferService);
  private readonly ownerEquityAccountInitialValueStateTransferService = inject(
    OwnerEquityAccountInitialValueStateTransferService,
  );

  private readonly balanceFromStateTransferService = this.balanceStateTransferService.hasState()
    ? this.balanceStateTransferService.getState()
    : undefined;

  private readonly ownerEquityAccountInitialValue =
    this.ownerEquityAccountInitialValueStateTransferService.getState();

  private readonly balanceFromServiceSignal =
    this.ownerEquityAccountInitialValueStateTransferService.hasState()
      ? this.balanceFilterService.find(
          this.ownerEquityAccountInitialValue.owner,
          this.ownerEquityAccountInitialValue.equityAccount.description,
        )
      : undefined;

  private readonly defaultBalance: Balance = {
    owner: '',
    equityAccount: { description: '', category: '' },
    initialValue: 0,
    balance: 0,
  };

  model = computed(() => {
    if (this.balanceFromStateTransferService) {
      return this.balanceFromStateTransferService;
    }

    return this.balanceFromServiceSignal?.() ?? this.defaultBalance;
  });
}
