import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { createEntry, entryFormToModel, EntryInsertUpdate, entryModelToForm } from './entry';
import { HttpClient } from '@angular/common/http';
import { Account } from '../account/account';
import { Owner } from '../owner/owner';
import { DateFieldComponent } from '../field/date-field.component';
import { SelectFieldComponent } from '../field/select-field.component';
import { NumberFieldComponent } from '../field/number-field.component';
import { InputFieldComponent } from '../field/input-field.component';
import { OwnerListService } from '../owner/owner-list-service';
import { AccountListService } from '../account/account-list-service';
import { EntryInsertService } from './entry-insert-service';
import { BeanInsertPanelComponent } from '../bean/bean-insert-panel.component';
import { AppMessageService } from '../app-message-service';
import { form, Field, required } from '@angular/forms/signals';

@Component({
  selector: 'app-entry-insert',
  imports: [
    CommonModule,
    DateFieldComponent,
    SelectFieldComponent,
    NumberFieldComponent,
    InputFieldComponent,
    BeanInsertPanelComponent,
    Field,
  ],
  template: `
    <app-bean-insert-panel
      [form]="form"
      [createBean]="createBean.bind(this)"
      [beanInsertService]="beanInsertService"
      [beanName]="beanName"
      [routerName]="routerName"
    >
      <app-date-fields label="Date" [autoFocus]="true" [field]="form.date" dataCy="input-date" />

      <app-select-fields
        label="In Owner"
        optionLabel="name"
        [options]="owners()"
        [field]="form.inOwner"
        dataCy="select-in-owner"
      />

      <app-select-fields
        label="In Account"
        optionLabel="description"
        [options]="inAccounts()"
        [field]="form.inAccount"
        dataCy="select-in-account"
      />

      <app-select-fields
        label="Out Owner"
        optionLabel="name"
        [options]="owners()"
        [field]="form.outOwner"
        dataCy="select-out-owner"
      />

      <app-select-fields
        label="Out Account"
        optionLabel="description"
        [options]="outAccounts()"
        [field]="form.outAccount"
        dataCy="select-out-account"
      />

      <app-number-fields label="Value" [field]="form.value" dataCy="input-value" />

      <app-input-fields label="Note" [field]="form.note" dataCy="input-note" />
    </app-bean-insert-panel>
  `,
})
export class EntryInsertComponent {
  form = form(signal(entryModelToForm(createEntry())), (f) => {
    required(f.date);
    required(f.inOwner);
    required(f.inAccount);
    required(f.outOwner);
    required(f.outAccount);
    required(f.value);
  });

  beanInsertService: EntryInsertService;
  routerName: string;
  beanName: string;

  inAccounts: WritableSignal<Account[]>;
  outAccounts: WritableSignal<Account[]>;
  owners: WritableSignal<Owner[]>;

  constructor() {
    const activatedRoute = inject(ActivatedRoute);
    const type = activatedRoute.snapshot.data['type'];
    this.routerName = `${type.toLowerCase()}Entries`;
    this.beanName = `${type} Entry`;
    const http = inject(HttpClient);
    this.beanInsertService = new EntryInsertService(http, type);

    this.inAccounts = new AccountListService(
      inject(AppMessageService),
      activatedRoute.snapshot.data['inAccountType'],
    ).findAll();
    this.outAccounts = new AccountListService(
      inject(AppMessageService),
      activatedRoute.snapshot.data['outAccountType'],
    ).findAll();
    this.owners = inject(OwnerListService).findAll();
  }

  createBean(): EntryInsertUpdate {
    return entryFormToModel(this.form().value());
  }
}
