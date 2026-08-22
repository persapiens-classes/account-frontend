import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '@openng/optimus-ui/button';
import { PanelModule } from '@openng/optimus-ui/panel';
import {
  entryModelToForm,
  EntryInsertUpdate,
  entryFormToModel,
  entryId,
  EntrySchema,
} from './entry';
import { HttpClient } from '@angular/common/http';
import { Account } from '../account/account';
import { Owner } from '../owner/owner';
import { InputFieldComponent } from '../field/input-field.component';
import { NumberFieldComponent } from '../field/number-field.component';
import { SelectFieldComponent } from '../field/select-field.component';
import { DateFieldComponent } from '../field/date-field.component';
import { AccountListService } from '../account/account-list-service';
import { OwnerListService } from '../owner/owner-list-service';
import { ModelUpdatePanelComponent } from '../models/model-update-panel.component';
import { EntryUpdateService } from './entry-update-service';
import { toModelFromHistory } from '../models/models';
import { AppMessageService } from '../app-message-service';
import { form, required } from '@angular/forms/signals';
import { PATHS } from '../app.paths';

@Component({
  selector: 'app-entry-update',
  imports: [
    ButtonModule,
    PanelModule,
    CommonModule,
    DateFieldComponent,
    SelectFieldComponent,
    NumberFieldComponent,
    InputFieldComponent,
    ModelUpdatePanelComponent,
  ],
  template: `
    <app-model-update-panel
      [form]="form"
      [modelFromHistory]="modelFromHistory"
      [createModel]="createModel.bind(this)"
      [modelUpdateService]="modelUpdateService"
      [modelName]="modelName"
      [routerName]="routerName"
      [modelIdFn]="modelIdFn"
    >
      <app-date-field label="Date" [autoFocus]="true" [formField]="form.date" dataCy="input-date" />
      <app-select-field
        label="In Owner"
        optionLabel="name"
        [options]="owners()"
        [formField]="form.inOwner"
        dataCy="select-in-owner"
      />

      <app-select-field
        label="In Account"
        optionLabel="description"
        [options]="inAccounts()"
        [formField]="form.inAccount"
        dataCy="select-in-account"
      />

      <app-select-field
        label="Out Owner"
        optionLabel="name"
        [options]="owners()"
        [formField]="form.outOwner"
        dataCy="select-out-owner"
      />

      <app-select-field
        label="Out Account"
        optionLabel="description"
        [options]="outAccounts()"
        [formField]="form.outAccount"
        dataCy="select-out-account"
      />

      <app-number-field label="Value" [formField]="form.value" dataCy="input-value" />
      <app-input-field label="Note" [formField]="form.note" dataCy="input-note" />
    </app-model-update-panel>
  `,
})
export class EntryUpdateComponent {
  modelFromHistory = toModelFromHistory(EntrySchema);
  form = form(signal(entryModelToForm(this.modelFromHistory)), (f) => {
    required(f.date);
    required(f.inAccount);
    required(f.inOwner);
    required(f.outOwner);
    required(f.outAccount);
    required(f.value);
  });

  routerName: string;
  modelName: string;
  modelUpdateService: EntryUpdateService;
  modelIdFn = entryId;

  inAccounts: WritableSignal<Account[]>;
  outAccounts: WritableSignal<Account[]>;
  owners: WritableSignal<Owner[]>;

  constructor() {
    const http = inject(HttpClient);
    const activatedRoute = inject(ActivatedRoute);
    const type = activatedRoute.snapshot.data['type'];
    this.routerName = `${type.toLowerCase()}${PATHS.ENTRY_PATH}`;
    this.modelName = `${type} Entry`;
    this.modelUpdateService = new EntryUpdateService(http, type);

    this.outAccounts = new AccountListService(
      inject(AppMessageService),
      activatedRoute.snapshot.data['outAccountType'],
    ).findAll();
    this.inAccounts = new AccountListService(
      inject(AppMessageService),
      activatedRoute.snapshot.data['inAccountType'],
    ).findAll();
    this.owners = inject(OwnerListService).findAll();
  }

  createModel(): EntryInsertUpdate {
    return entryFormToModel(this.form().value());
  }
}
