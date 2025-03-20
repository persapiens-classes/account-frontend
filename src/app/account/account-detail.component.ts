import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { Account } from './account';
import { HttpClient } from '@angular/common/http';
import { BeanDetailComponent } from '../bean/bean-detail.component';
import { AccountService } from './account-service';
import { DetailField } from "../detail-field.component";

@Component({
  selector: 'account-detail',
  imports: [CommonModule, ButtonModule, PanelModule, DetailField],
  template: `
    <p-panel header="Detail">
      <a-detail-field strong="Description" value="{{ bean.description }}"/>
      <a-detail-field strong="Category" value="{{ bean.category }}"/>

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
