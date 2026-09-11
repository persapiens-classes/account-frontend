import { Component, inject, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '@openng/optimus-ui/button';
import { PanelModule } from '@openng/optimus-ui/panel';
import { Account, accountFormToModel, accountId } from './account';
import { Category } from '../category/category';
import { HttpClient } from '@angular/common/http';
import { InputFieldComponent } from '../field/input-field.component';
import { SelectFieldComponent } from '../field/select-field.component';
import { CategoryListService } from '../category/category-list-service';
import { AccountUpdateService } from './account-update-service';
import { ModelUpdatePanelComponent } from '../models/model-update-panel.component';
import { AppMessageService } from '../app-message-service';
import { PATHS } from '../app.paths';
import { accountForm } from './account-form';
import { AccountStateTransferService } from '../models/models-state-transfer-service';

@Component({
  selector: 'app-account-update',
  imports: [
    ButtonModule,
    PanelModule,
    CommonModule,
    InputFieldComponent,
    SelectFieldComponent,
    ModelUpdatePanelComponent,
  ],
  template: `
    <app-model-update-panel
      [form]="form"
      [model]="model"
      [createModel]="createModel.bind(this)"
      [modelUpdateService]="modelUpdateService"
      [modelName]="modelName"
      [routerName]="routerName"
      [modelIdFn]="modelIdFn"
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
    </app-model-update-panel>
  `,
})
export class AccountUpdateComponent {
  stateTransferService = inject(AccountStateTransferService);
  model = this.stateTransferService.getState();
  modelIdFn = accountId;
  form = accountForm(this.model);

  routerName: string;
  modelName: string;
  modelUpdateService: AccountUpdateService;

  categories: WritableSignal<Category[]>;

  constructor() {
    const activatedRoute = inject(ActivatedRoute);
    const type = activatedRoute.snapshot.data['type'];
    this.modelName = `${type} Account`;
    this.routerName = `${type.toLowerCase()}${PATHS.ACCOUNT_PATH}`;
    const http = inject(HttpClient);
    this.modelUpdateService = new AccountUpdateService(http, type);

    this.categories = new CategoryListService(
      inject(AppMessageService),
      activatedRoute.snapshot.data['categoryType'],
    ).findAll();
  }

  createModel(): Account {
    return accountFormToModel(this.form().value());
  }
}
