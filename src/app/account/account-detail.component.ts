import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Account, createAccount } from './account';
import { DetailFieldComponent } from '../field/detail-field.component';
import { defaultJsonToBean, toBeanFromHistory } from '../bean/bean';
import { ActivatedRoute } from '@angular/router';
import { BeanDetailPanelComponent } from '../bean/bean-detail-panel.component';

@Component({
  selector: 'app-account-detail',
  imports: [CommonModule, DetailFieldComponent, BeanDetailPanelComponent],
  template: `
    <app-bean-detail-panel [routerName]="routerName" [bean]="bean">
      <app-detail-field strong="Description" value="{{ bean.description }}" />
      <app-detail-field strong="Category" value="{{ bean.category }}" />
    </app-bean-detail-panel>
  `,
})
export class AccountDetailComponent {
  bean: Account;
  routerName: string;
  constructor() {
    const type = inject(ActivatedRoute).snapshot.data['type'];
    this.routerName = `${type.toLowerCase()}Accounts`;
    this.bean = toBeanFromHistory(createAccount, defaultJsonToBean);
  }
}
