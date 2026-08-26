import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  Account,
  accountFormToModel,
  accountId,
  accountModelToForm,
  createAccount,
} from './account';
import { Category } from '../category/category';
import { HttpClient } from '@angular/common/http';
import { CategoryListService } from '../category/category-list-service';
import { ModelInsertPanelComponent } from '../models/model-insert-panel.component';
import { InputFieldComponent } from '../field/input-field.component';
import { SelectFieldComponent } from '../field/select-field.component';
import { AccountInsertService } from './account-insert-service';
import { AppMessageService } from '../app-message-service';
import { form, maxLength, minLength, required } from '@angular/forms/signals';
import { PATHS } from '../app.paths';

@Component({
  selector: 'app-account-insert',
  imports: [CommonModule, InputFieldComponent, SelectFieldComponent, ModelInsertPanelComponent],
  template: `
    <app-model-insert-panel
      [form]="form"
      [createModel]="createModel.bind(this)"
      [modelIdFn]="modelIdFn"
      [modelInsertService]="modelInsertService"
      [modelName]="modelName"
      [routerName]="routerName"
    >
      <app-input-field
        label="Description"
        [autoFocus]="true"
        [formField]="form.description"
        dataCy="input-description"
      />

      <app-select-field
        label="Category"
        optionLabel="description"
        [options]="categories()"
        [formField]="form.category"
        dataCy="select-category"
      />
    </app-model-insert-panel>
  `,
})
export class AccountInsertComponent {
  form = form(signal(accountModelToForm(createAccount())), (f) => {
    required(f.description);
    minLength(f.description, 3);
    maxLength(f.description, 255);
    required(f.category);
    minLength(f.category.description, 3);
  });
  routerName: string;
  modelName: string;
  modelInsertService: AccountInsertService;
  modelIdFn = accountId;

  categories: WritableSignal<Category[]>;

  constructor() {
    const activatedRoute = inject(ActivatedRoute);
    const http = inject(HttpClient);

    this.categories = new CategoryListService(
      inject(AppMessageService),
      activatedRoute.snapshot.data['categoryType'],
    ).findAll();

    const type = activatedRoute.snapshot.data['type'];
    this.routerName = `${type.toLowerCase()}${PATHS.ACCOUNT_PATH}`;
    this.modelName = `${type} Account`;
    this.modelInsertService = new AccountInsertService(http, type);
  }

  createModel(): Account {
    return accountFormToModel(this.form().value());
  }
}
