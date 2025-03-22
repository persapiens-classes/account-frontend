import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Account } from './account';
import { HttpClient } from '@angular/common/http';
import { AccountService } from './account-service';
import { DetailField } from "../field/detail-field.component";
import { BeanDetailComponent } from '../bean/bean-detail.component';

@Component({
  selector: 'account-detail',
  imports: [CommonModule, DetailField],
  template: `
    <a-detail-field strong="Description" value="{{ bean.description }}"/>
    <a-detail-field strong="Category" value="{{ bean.category }}"/>
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
