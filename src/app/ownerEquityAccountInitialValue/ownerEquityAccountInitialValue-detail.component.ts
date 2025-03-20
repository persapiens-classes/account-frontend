import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { AutoFocusModule } from 'primeng/autofocus';
import { TooltipModule } from 'primeng/tooltip';
import { OwnerEquityAccountInitialValue, OwnerEquityAccountInitialValueInsert } from './ownerEquityAccountInitialValue';
import { BeanDetailComponent } from '../bean/bean-detail.component';
import { OwnerEquityAccountInitialValueService } from './ownerEquityAccountInitialValue-service';
import { BalanceService } from './balance-service';
import { Observable } from 'rxjs';
import { DetailField } from "../field/detail-field.component";

@Component({
  selector: 'owner-equity-account-initial-value-detail',
  imports: [CommonModule, ButtonModule, PanelModule, DetailField],
  template: `
    <p-panel header="Detail">
      <a-detail-field strong="Owner" value="{{ bean.owner }}"/>
      <a-detail-field strong="Equity Account" value="{{ bean.equityAccount.description }} - {{ bean.equityAccount.category }}"/>
      <a-detail-field strong="Balance" value="{{ this.balance$ | async | number:'1.2-2' }}"/>
      <a-detail-field strong="Initial Value" value="{{ bean.value | number:'1.2-2' }}"/>

      <p-button icon="pi pi-list" (onClick)="list()" [style]="{'margin-right': '10px'}" pTooltip="Back to List"/>
      <p-button icon="pi pi-pencil" (onClick)="startUpdate()" pTooltip="Start Edit"/>
    </p-panel>
  `
})
export class OwnerEquityAccountInitialValueDetailComponent extends BeanDetailComponent<OwnerEquityAccountInitialValue, OwnerEquityAccountInitialValueInsert, number> {
  balance$: Observable<number>

  constructor(
    router: Router,
    ownerService: OwnerEquityAccountInitialValueService,
    balanceService: BalanceService
  ) {
    super(router, ownerService)

    this.balance$ = balanceService.find(this.bean.owner, this.bean.equityAccount.description)
  }

}
