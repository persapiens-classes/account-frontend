import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  createEntry,
  entryFormToModel,
  entryId,
  EntryInsertUpdate,
  entryModelToForm,
} from './entry';
import { HttpClient } from '@angular/common/http';
import { DateFieldComponent } from '../field/date-field.component';
import { SelectFieldComponent } from '../field/select-field.component';
import { NumberFieldComponent } from '../field/number-field.component';
import { InputFieldComponent } from '../field/input-field.component';
import { OwnerListService } from '../owner/owner-list-service';
import { AccountListService } from '../account/account-list-service';
import { EntryInsertService } from './entry-insert-service';
import { ModelInsertPanelComponent } from '../models/model-insert-panel.component';
import { AppMessageService } from '../app-message-service';
import { form, FormField, required } from '@angular/forms/signals';
import { PATHS } from '../app.paths';
import { EntryStateTransferService } from '../models/models-state-transfer-service';

@Component({
  selector: 'app-entry-insert',
  imports: [
    CommonModule,
    DateFieldComponent,
    SelectFieldComponent,
    NumberFieldComponent,
    InputFieldComponent,
    ModelInsertPanelComponent,
    FormField,
  ],
  template: `
    <app-model-insert-panel
      [form]="form"
      [createModel]="createModel.bind(this)"
      [modelInsertService]="modelInsertService"
      [modelName]="modelName"
      [routerName]="routerName"
      [modelIdFn]="modelIdFn"
      [stateTransferService]="stateTransferService"
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

      <app-number-field label="Value" [formField]="form.value" dataCy="inputnumber-value" />
      <app-input-field label="Note" [formField]="form.note" dataCy="input-note" />
    </app-model-insert-panel>
  `,
})
export class EntryInsertComponent {
  stateTransferService = inject(EntryStateTransferService);
  form = form(signal(entryModelToForm(createEntry())), (f) => {
    required(f.date);
    required(f.inOwner);
    required(f.inAccount);
    required(f.outOwner);
    required(f.outAccount);
    required(f.value);
  });

  modelIdFn = entryId;

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly type = this.activatedRoute.snapshot.data['type'];
  routerName = `${this.type.toLowerCase()}${PATHS.ENTRY_PATH}`;
  modelName = `${this.type} Entry`;
  modelInsertService = new EntryInsertService(inject(HttpClient), this.type);

  inAccounts = new AccountListService(
    inject(AppMessageService),
    this.activatedRoute.snapshot.data['inAccountType'],
  ).findAll();
  outAccounts = new AccountListService(
    inject(AppMessageService),
    this.activatedRoute.snapshot.data['outAccountType'],
  ).findAll();
  owners = inject(OwnerListService).findAll();

  createModel(): EntryInsertUpdate {
    return entryFormToModel(this.form().value());
  }
}
