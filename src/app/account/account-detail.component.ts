import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Account } from './account';
import { DetailField } from "../field/detail-field.component";
import { BeanDetailComponent } from '../bean/bean-detail.component';
import { AccountCreateService } from './account-create-service';

@Component({
  selector: 'account-detail',
  imports: [CommonModule, DetailField],
  template: `
    <a-detail-field strong="Description" value="{{ bean.description }}"/>
    <a-detail-field strong="Category" value="{{ bean.category }}"/>
  `
})
export class AccountDetailComponent extends BeanDetailComponent<Account> {

  constructor() {
    super(new AccountCreateService())
  }

}
