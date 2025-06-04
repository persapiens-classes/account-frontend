import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Account } from './account';
import { DetailFieldComponent } from '../field/detail-field.component';
import { BeanDetailComponent } from '../bean/bean-detail.component';
import { AccountCreateService } from './account-create-service';

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
    super(new AccountCreateService());
  }
}
