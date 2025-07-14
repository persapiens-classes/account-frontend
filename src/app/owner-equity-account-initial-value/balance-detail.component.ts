import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailFieldComponent } from '../field/detail-field.component';
import { Balance, createBalance } from './balance';
import { PreviousRouteService } from './previous-route-service';
import { BalanceFilterService } from './balance-filter-service';
import { firstValueFrom } from 'rxjs';
import { defaultJsonToBean, toBeanFromHistory } from '../bean/bean';
import { BeanDetailPanelComponent } from '../bean/bean-detail-panel.component';

@Component({
  selector: 'app-balance-detail',
  imports: [CommonModule, DetailFieldComponent, BeanDetailPanelComponent],
  template: `
    <app-bean-detail-panel [routerName]="'balances'" [bean]="bean">
      <app-detail-field strong="Owner" value="{{ bean.owner }}" />
      <app-detail-field
        strong="Equity Account"
        value="{{ bean.equityAccount.description }} - {{ bean.equityAccount.category }}"
      />
      <app-detail-field strong="Balance" value="{{ bean.balance | number: '1.2-2' }}" />
      <app-detail-field strong="Initial Value" value="{{ bean.initialValue | number: '1.2-2' }}" />
    </app-bean-detail-panel>
  `,
})
export class BalanceDetailComponent implements OnInit {
  bean: Balance;
  private readonly previousRouteService = inject(PreviousRouteService);
  private readonly balanceFilterService = inject(BalanceFilterService);
  constructor() {
    this.bean = toBeanFromHistory(createBalance, defaultJsonToBean);
  }

  ngOnInit(): void {
    this.initAsync();
  }

  private async initAsync(): Promise<void> {
    if (
      this.previousRouteService.getPreviousUrl()?.endsWith('/edit') ||
      this.previousRouteService.getPreviousUrl()?.endsWith('/new')
    ) {
      this.bean = await firstValueFrom(
        this.balanceFilterService.find(this.bean.owner, this.bean.equityAccount.description),
      );
    }
  }
}
