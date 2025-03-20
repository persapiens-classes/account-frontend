import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { AutoFocusModule } from 'primeng/autofocus';
import { TooltipModule } from 'primeng/tooltip';
import { Account } from './account';
import { SelectModule } from 'primeng/select';
import { HttpClient } from '@angular/common/http';
import { BeanDetailComponent } from '../bean/bean-detail.component';
import { AccountService } from './account-service';

@Component({
  selector: 'account-detail',
  imports: [SelectModule, ButtonModule, InputTextModule, PanelModule, AutoFocusModule, CommonModule, TooltipModule],
  template: `
      <p-panel header="Detail">
        <div class="margin-bottom detail-field">
          <strong>Description</strong>
          {{ bean.description }}
        </div>

        <div class="margin-bottom detail-field">
          <strong>Category</strong>
          {{ bean.category }}
        </div>

        <p-button icon="pi pi-list" (onClick)="list()" [style]="{'margin-right': '10px'}" pTooltip="Back to List"/>
        <p-button icon="pi pi-pencil" (onClick)="startUpdate()" pTooltip="Start Edit"/>
      </p-panel>
  `
})
export class AccountDetailComponent extends BeanDetailComponent<Account, Account, Account> {

  constructor(
    router: Router,
    http: HttpClient,
    route: ActivatedRoute
  ) {
    super(router, new AccountService(http, route.snapshot.data['type']))
  }

}
