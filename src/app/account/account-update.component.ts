import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { Account } from './account';
import { BeanUpdateComponent } from '../bean/bean-update.component';
import { Category } from '../category/category';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { InputField } from '../field/input-field.component';
import { SelectField } from '../field/select-field.component';
import { AccountUpdateFormGroupService } from './account-update-form-group.service';
import { CategoryListService } from '../category/category-list-service';

@Component({
  selector: 'account-update',
  imports: [ReactiveFormsModule, ButtonModule, PanelModule, CommonModule, InputField, SelectField],
  template: `
    <a-input-field
      label="Description"
      [autoFocus]="true"
      [control]="form.get('inputDescription')!"
    />

    <a-select-field
      label="Category"
      placeholder="Select one category"
      optionLabel="description"
      [options]="(categories$ | async)!"
      [control]="form.get('selectCategory')!"
    />
  `,
})
export class AccountUpdateComponent extends BeanUpdateComponent<Account> {
  form: FormGroup;

  categories$: Observable<Array<Category>>;

  constructor(
    accountFormGroupService: AccountUpdateFormGroupService,
    http: HttpClient,
    route: ActivatedRoute,
  ) {
    super(createBean);

    this.form = accountFormGroupService.form;

    this.categories$ = new CategoryListService(http, route.snapshot.data['categoryType']).findAll();
  }
}

function createBean(form: FormGroup): Account {
  return new Account(form.value.inputDescription, form.value.selectCategory.description);
}
