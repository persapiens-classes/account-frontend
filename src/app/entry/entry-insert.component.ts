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
import { form, FormField, required } from '@angular/forms/signals';

@Component({
  selector: 'app-entry-insert',
  imports: [
    CommonModule,
    DateFieldComponent,
    SelectFieldComponent,
    NumberFieldComponent,
    InputFieldComponent,
    BeanInsertPanelComponent,
    FormField,
  ],
  template: `
    <app-bean-insert-panel
      [form]="form"
      [createBean]="createBean.bind(this)"
      [beanInsertService]="beanInsertService"
      [beanName]="beanName"
      [routerName]="routerName"
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
