import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import {
  createEntry,
  entryModelToForm,
  EntryInsertUpdate,
  jsonToEntry,
  entryFormToModel,
} from './entry';
import { HttpClient } from '@angular/common/http';
import { Account } from '../account/account';
import { Owner } from '../owner/owner';
import { InputFieldSComponent } from '../field/input-fields.component';
import { NumberFieldSComponent } from '../field/number-fields.component';
import { SelectFieldSComponent } from '../field/select-fields.component';
import { DateFieldSComponent } from '../field/date-fields.component';
import { AccountListService } from '../account/account-list-service';
import { OwnerListService } from '../owner/owner-list-service';
import { EntryInsertComponent } from './entry-insert.component';
import { BeanUpdatePanelComponent } from '../bean/bean-update-panel.component';
import { EntryUpdateService } from './entry-update-service';
import { toBeanFromHistory } from '../bean/bean';
import { AppMessageService } from '../app-message-service';
import { form, required } from '@angular/forms/signals';

@Component({
  selector: 'app-entry-update',
  imports: [
    ButtonModule,
    PanelModule,
    CommonModule,
    DateFieldSComponent,
    SelectFieldSComponent,
    NumberFieldSComponent,
    InputFieldSComponent,
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
      <app-date-fields label="Date" [autoFocus]="true" [field]="form.date" />

      <app-select-fields
        label="In Owner"
        optionLabel="name"
        [options]="owners()"
        [field]="form.inOwner"
      />

      <app-select-fields
        label="In Account"
        optionLabel="description"
        [options]="inAccounts()"
        [field]="form.inAccount"
      />

      <app-select-fields
        label="Out Owner"
        optionLabel="name"
        [options]="owners()"
        [field]="form.outOwner"
      />

      <app-select-fields
        label="Out Account"
        optionLabel="description"
        [options]="outAccounts()"
        [field]="form.outAccount"
      />

      <app-number-fields label="Value" [field]="form.value" />

      <app-input-fields label="Note" [field]="form.note" />
    </app-bean-update-panel>
  `,
})
export class EntryUpdateComponent {
  beanFromHistory = toBeanFromHistory(createEntry, jsonToEntry);
  form = form(signal(entryModelToForm(this.beanFromHistory)), (f) => {
    required(f.date);
    required(f.inOwner);
    required(f.inAccount);
    required(f.outOwner);
    required(f.outAccount);
    required(f.value);
  });

  routerName: string;
  beanName: string;
  beanUpdateService: EntryUpdateService;

  inAccounts: WritableSignal<Account[]>;
  outAccounts: WritableSignal<Account[]>;
  owners: WritableSignal<Owner[]>;

  constructor() {
    const http = inject(HttpClient);
    const activatedRoute = inject(ActivatedRoute);
    const type = activatedRoute.snapshot.data['type'];
    this.routerName = `${type.toLowerCase()}Entries`;
    this.beanName = `${type} Entry`;
    this.beanUpdateService = new EntryUpdateService(http, type);

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

  createBean(): EntryInsertUpdate {
    return entryFormToModel(this.form().value());
  }
}
