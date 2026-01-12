import { form, minLength, required } from '@angular/forms/signals';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { Account, accountFormToModel, accountModelToForm, createAccount } from './account';
import { Category } from '../category/category';
import { HttpClient } from '@angular/common/http';
import { InputFieldComponent } from '../field/input-field.component';
import { SelectFieldComponent } from '../field/select-field.component';
import { CategoryListService } from '../category/category-list-service';
import { AccountUpdateService } from './account-update-service';
import { toBeanFromHistory } from '../bean/bean';
import { BeanUpdatePanelComponent } from '../bean/bean-update-panel.component';
import { AppMessageService } from '../app-message-service';

@Component({
  selector: 'app-account-update',
  imports: [
    ButtonModule,
    PanelModule,
    CommonModule,
    InputFieldComponent,
    SelectFieldComponent,
    BeanUpdatePanelComponent,
  ],
  template: `
    <app-bean-update-panel
      [form]="form"
      [beanFromHistory]="beanFromHistory"
      [createBean]="createBean.bind(this)"
      [beanUpdateService]="beanUpdateService"
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
    </app-bean-update-panel>
  `,
})
export class AccountUpdateComponent {
  beanFromHistory = toBeanFromHistory(createAccount);
  form = form(signal(accountModelToForm(this.beanFromHistory)), (f) => {
    required(f.description);
    minLength(f.description, 3);
    required(f.category);
  });

  routerName: string;
  beanName: string;
  beanUpdateService: AccountUpdateService;

  categories: WritableSignal<Category[]>;

  constructor() {
    const activatedRoute = inject(ActivatedRoute);
    const type = activatedRoute.snapshot.data['type'];
    this.beanName = `${type} Account`;
    this.routerName = `${type.toLowerCase()}Accounts`;
    const http = inject(HttpClient);
    this.beanUpdateService = new AccountUpdateService(http, type);

    this.categories = new CategoryListService(
      inject(AppMessageService),
      activatedRoute.snapshot.data['categoryType'],
    ).findAll();
  }

  createBean(): Account {
    return accountFormToModel(this.form().value());
  }
}
