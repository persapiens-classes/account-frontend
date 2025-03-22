import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Account } from './account';
import { AccountService } from './account-service';
import { BeanInsertComponent } from '../bean/bean-insert.component';
import { Category } from '../category/category';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CategoryService } from '../category/category-service';
import { InputField } from "../field/input-field.component";
import { SelectField } from "../field/select-field.component";
import { AccountInsertFormGroupService } from './account-insert-form-group.service';

@Component({
  selector: 'account-insert',
  imports: [ReactiveFormsModule, CommonModule, InputField, SelectField],
  template: `
    <a-input-field label="Description" 
      [autoFocus]=true
      [control]="form.get('inputDescription')!" />

    <a-select-field label="Category" 
      placeholder="Select one category" 
      optionLabel="description"
      [options]="(categories$ | async)!"
      [control]="form.get('selectCategory')!" />
  `
})
export class AccountInsertComponent extends BeanInsertComponent<Account, Account, Account> {
  form: FormGroup

  categories$: Observable<Array<Category>>

  constructor(
    accountFormGroupService: AccountInsertFormGroupService,
    http: HttpClient,
    route: ActivatedRoute
  ) {
    super(new AccountService(http, route.snapshot.data['type']))

    this.form = accountFormGroupService.form

    this.categories$ = new CategoryService(http, route.snapshot.data['type']).findAll()
  }

  createBean(): Account {
    return new Account(this.form.value.inputDescription, this.form.value.selectCategory.description)
  }

}
