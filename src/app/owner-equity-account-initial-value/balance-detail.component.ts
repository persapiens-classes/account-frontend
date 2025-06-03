import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailField } from "../field/detail-field.component";
import { BeanDetailComponent } from '../bean/bean-detail.component';
import { Balance } from './balance';
import { BalanceCreateService } from './balance-create-service';
import { PreviousRouteService } from './previous-route-service';
import { BalanceFilterService } from './balance-filter-service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'balance-detail',
  imports: [CommonModule, DetailField],
  template: `
    <a-detail-field strong="Owner" value="{{ bean.owner }}"/>
    <a-detail-field strong="Equity Account" value="{{ bean.equityAccount.description }} - {{ bean.equityAccount.category }}"/>
    <a-detail-field strong="Balance" value="{{ bean.balance | number:'1.2-2' }}"/>
    <a-detail-field strong="Initial Value" value="{{ bean.initialValue | number:'1.2-2' }}"/>
  `
})
export class BalanceDetailComponent extends BeanDetailComponent<Balance> {
  constructor(private previousRouteService: PreviousRouteService,
    private balanceFilterService: BalanceFilterService
  ) {
    super(new BalanceCreateService())
  }

  async ngOnInit(): Promise<void> {
    if (this.previousRouteService.getPreviousUrl()?.endsWith("/edit")
      || this.previousRouteService.getPreviousUrl()?.endsWith("/new")) {
      this.bean = await firstValueFrom(this.balanceFilterService.find(this.bean.owner, this.bean.equityAccount.description))
    }
  }

}
