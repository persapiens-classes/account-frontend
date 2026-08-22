import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailFieldComponent } from '../field/detail-field.component';
import { Balance, BalanceSchema } from './balance';
import { PreviousRouteService } from './previous-route-service';
import { BalanceFilterService } from './balance-filter-service';
import { firstValueFrom } from 'rxjs';
import { toModelFromHistory } from '../models/models';
import { ModelDetailPanelComponent } from '../models/model-detail-panel.component';

@Component({
  selector: 'app-balance-detail',
  imports: [CommonModule, DetailFieldComponent, ModelDetailPanelComponent],
  template: `
    <app-model-detail-panel [routerName]="'balances'" [model]="model">
      <app-detail-field strong="Owner" value="{{ model.owner }}" />
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
  private readonly previousRouteService = inject(PreviousRouteService);
  private readonly balanceFilterService = inject(BalanceFilterService);
  constructor() {
    this.model = toModelFromHistory<Balance>(BalanceSchema);
  }

  ngOnInit(): void {
    this.initAsync();
  }

  private async initAsync(): Promise<void> {
    if (
      this.previousRouteService.getPreviousUrl()?.endsWith('/edit') ||
      this.previousRouteService.getPreviousUrl()?.endsWith('/new')
    ) {
      this.model = await firstValueFrom(
        this.balanceFilterService.find(this.model.owner, this.model.equityAccount.description),
      );
    }
  }
}
