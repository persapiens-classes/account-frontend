import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Account, accountFormToModel, accountModelToForm, createAccount } from './account';
import { Category } from '../category/category';
import { HttpClient } from '@angular/common/http';
import { CategoryListService } from '../category/category-list-service';
import { BeanInsertPanelComponent } from '../bean/bean-insert-panel.component';
import { InputFieldComponent } from '../field/input-field.component';
import { SelectFieldComponent } from '../field/select-field.component';
import { AccountInsertService } from './account-insert-service';
import { AppMessageService } from '../app-message-service';
import { form, minLength, required } from '@angular/forms/signals';

@Component({
  selector: 'app-account-insert',
  imports: [CommonModule, InputFieldComponent, SelectFieldComponent, BeanInsertPanelComponent],
  template: `
    <app-bean-insert-panel
      [form]="form"
      [createBean]="createBean.bind(this)"
      [beanInsertService]="beanInsertService"
      [beanName]="beanName"
      [routerName]="routerName"
    >
      <app-input-field
        label="Description"
        [autoFocus]="true"
        [field]="form.description"
        dataCy="input-description"
      />

      <app-select-field
        label="Category"
        optionLabel="description"
        [options]="categories()"
        [field]="form.category"
        dataCy="select-category"
      />
    </app-bean-insert-panel>
  `,
})
export class AccountInsertComponent {
  form = form(signal(accountModelToForm(createAccount())), (f) => {
    required(f.description);
    minLength(f.description, 3);
    required(f.category);
  });
  routerName: string;
  beanName: string;
  beanInsertService: AccountInsertService;

  categories: WritableSignal<Category[]>;

  constructor() {
    const activatedRoute = inject(ActivatedRoute);
    const http = inject(HttpClient);

    this.categories = new CategoryListService(
      inject(AppMessageService),
      activatedRoute.snapshot.data['categoryType'],
    ).findAll();

    const type = activatedRoute.snapshot.data['type'];
    this.routerName = `${type.toLowerCase()}Accounts`;
    this.beanName = `${type} Account`;
    this.beanInsertService = new AccountInsertService(http, type);
  }

  createBean(): Account {
    return accountFormToModel(this.form().value());
  }
}
