import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailFieldComponent } from '../field/detail-field.component';
import { BeanDetailComponent } from '../bean/bean-detail.component';
import { Balance } from './balance';
import { BalanceCreateService } from './balance-create-service';
import { PreviousRouteService } from './previous-route-service';
import { BalanceFilterService } from './balance-filter-service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-balance-detail',
  imports: [CommonModule, DetailFieldComponent],
  template: `
    <app-detail-field strong="Owner" value="{{ bean.owner }}" />
    <app-detail-field
      strong="Equity Account"
      value="{{ bean.equityAccount.description }} - {{ bean.equityAccount.category }}"
    />
    <app-detail-field strong="Balance" value="{{ bean.balance | number: '1.2-2' }}" />
    <app-detail-field strong="Initial Value" value="{{ bean.initialValue | number: '1.2-2' }}" />
  `,
})
export class BalanceDetailComponent extends BeanDetailComponent<Balance> implements OnInit {
  constructor(
    private readonly previousRouteService: PreviousRouteService,
    private readonly balanceFilterService: BalanceFilterService,
  ) {
    super(new BalanceCreateService());
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
