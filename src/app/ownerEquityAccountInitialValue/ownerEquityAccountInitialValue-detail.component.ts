import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { AutoFocusModule } from 'primeng/autofocus';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { OwnerEquityAccountInitialValue, OwnerEquityAccountInitialValueInsert } from './ownerEquityAccountInitialValue';
import { BeanDetailComponent } from '../bean/bean-detail.component';
import { OwnerEquityAccountInitialValueService } from './ownerEquityAccountInitialValue-service';

@Component({
  selector: 'ownerEquityAccountInitialValue-detail',
  imports: [ButtonModule, InputTextModule, PanelModule, AutoFocusModule, DividerModule, CommonModule, TooltipModule],
  template: `
      <p-panel header="Detail">
        <div style="margin-bottom: 10px">
          <label>Owner:</label>
          {{ bean.owner }}
        </div>
        <div style="margin-bottom: 10px">
        <label>Equity Account:</label>
        {{ bean.equityAccount.description }} - {{ bean.equityAccount.category }}
        </div>
        <div style="margin-bottom: 10px">
        <label>Value:</label>
        {{ bean.value }}
        </div>
        <p-divider />
        <p-button icon="pi pi-list" (onClick)="list()" [style]="{'margin-right': '10px'}" pTooltip="Back to List"/>
        <p-button icon="pi pi-pencil" (onClick)="startUpdate()" pTooltip="Start Edit"/>
      </p-panel>
  `
})
export class OwnerEquityAccountInitialValueDetailComponent extends BeanDetailComponent<OwnerEquityAccountInitialValue, OwnerEquityAccountInitialValueInsert, number> {

  constructor(
    router: Router,
    ownerService: OwnerEquityAccountInitialValueService
  ) {
    super(router, ownerService)
  }

}
