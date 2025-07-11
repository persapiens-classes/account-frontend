import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Account, createAccount } from './account';
import { DetailFieldComponent } from '../field/detail-field.component';
import { BeanDetailComponent } from '../bean/bean-detail.component';
import { defaultJsonToBean } from '../bean/bean';

@Component({
  selector: 'app-account-detail',
  imports: [CommonModule, DetailFieldComponent],
  template: `
    <app-detail-field strong="Description" value="{{ bean.description }}" />
    <app-detail-field strong="Category" value="{{ bean.category }}" />
  `,
})
export class AccountDetailComponent extends BeanDetailComponent<Account> {
  constructor() {
    super(createAccount, defaultJsonToBean);
  }
}
