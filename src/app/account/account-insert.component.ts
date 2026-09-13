import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Account, accountFormToModel, accountId, createAccount } from './account';
import { HttpClient } from '@angular/common/http';
import { CategoryListService } from '../category/category-list-service';
import { ModelInsertPanelComponent } from '../models/model-insert-panel.component';
import { InputFieldComponent } from '../field/input-field.component';
import { SelectFieldComponent } from '../field/select-field.component';
import { AccountInsertService } from './account-insert-service';
import { AppMessageService } from '../app-message-service';
import { PATHS } from '../app.paths';
import { accountForm } from './account-form';
import { AccountStateTransferService } from '../models/models-state-transfer-service';

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
      [stateTransferService]="stateTransferService"
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
  form = accountForm(createAccount());
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly type = this.activatedRoute.snapshot.data['type'];
  routerName = `${this.type.toLowerCase()}${PATHS.ACCOUNT_PATH}`;
  modelName = `${this.type} Account`;
  modelInsertService = new AccountInsertService(inject(HttpClient), this.type);
  modelIdFn = accountId;
  stateTransferService = inject(AccountStateTransferService);

  categories = new CategoryListService(
    inject(AppMessageService),
    this.activatedRoute.snapshot.data['categoryType'],
  ).findAll();

  createModel(): Account {
    return accountFormToModel(this.form().value());
  }
}
