import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwnerEquityAccountInitialValue, OwnerEquityAccountInitialValueInsert } from './owner-equity-account-initial-value';
import { BalanceService } from './balance-service';
import { Observable } from 'rxjs';
import { DetailField } from "../field/detail-field.component";
import { BeanDetailComponent } from '../bean/bean-detail.component';
import { OwnerEquityAccountInitialValueCreateService } from './owner-equity-account-initial-value-create-service';

@Component({
  selector: 'owner-equity-account-initial-value-detail',
  imports: [CommonModule, DetailField],
  template: `
    <a-detail-field strong="Owner" value="{{ bean.owner }}"/>
    <a-detail-field strong="Equity Account" value="{{ bean.equityAccount.description }} - {{ bean.equityAccount.category }}"/>
    <a-detail-field strong="Balance" value="{{ this.balance$ | async | number:'1.2-2' }}"/>
    <a-detail-field strong="Initial Value" value="{{ bean.value | number:'1.2-2' }}"/>
  `
})
export class OwnerEquityAccountInitialValueDetailComponent extends BeanDetailComponent<OwnerEquityAccountInitialValue, OwnerEquityAccountInitialValueInsert, number> {
  balance$: Observable<number>

  constructor(
    balanceService: BalanceService
  ) {
    super(new OwnerEquityAccountInitialValueCreateService())

    this.balance$ = balanceService.find(this.bean.owner, this.bean.equityAccount.description)
  }

}
