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

@Component({
  selector: 'ownerEquityAccountInitialValue-detail',
  imports: [AsyncPipe, ButtonModule, InputTextModule, PanelModule, AutoFocusModule, CommonModule, TooltipModule],
  template: `
      <p-panel header="Detail">
        <div class="margin-bottom detail-field">
          <strong>Owner</strong>
          {{ bean.owner }}
        </div>

        <div class="margin-bottom detail-field">
          <strong>Equity Account</strong>
          {{ bean.equityAccount.description }} - {{ bean.equityAccount.category }}
        </div>

        <div class="margin-bottom detail-field">
          <strong>Balance</strong>
          {{ this.balance$ | async | number:'1.2-2' }}
        </div>

        <div class="margin-bottom detail-field">
          <strong>Initial Value</strong>
          {{ bean.value | number:'1.2-2' }}
        </div>

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
