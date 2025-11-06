import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { createEntry, entryFormToModel, EntryInsertUpdate, entryModelToForm } from './entry';
import { HttpClient } from '@angular/common/http';
import { Account } from '../account/account';
import { Owner } from '../owner/owner';
import { DateFieldSComponent } from '../field/date-fields.component';
import { SelectFieldSComponent } from '../field/select-fields.component';
import { NumberFieldSComponent } from '../field/number-fields.component';
import { InputFieldSComponent } from '../field/input-fields.component';
import { OwnerListService } from '../owner/owner-list-service';
import { AccountListService } from '../account/account-list-service';
import { EntryInsertService } from './entry-insert-service';
import { BeanInsertPanelsComponent } from '../bean/bean-insert-panels.component';
import { AppMessageService } from '../app-message-service';
import { form, required } from '@angular/forms/signals';

@Component({
  selector: 'app-entry-insert',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    DateFieldSComponent,
    SelectFieldSComponent,
    NumberFieldSComponent,
    InputFieldSComponent,
    BeanInsertPanelsComponent,
  ],
  template: `
    <app-bean-insert-panels
      [form]="form"
      [createBean]="createBean.bind(this)"
      [beanInsertService]="beanInsertService"
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
    </app-bean-insert-panels>
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
  routerName: string;
  beanName: string;
  beanInsertService: EntryInsertService;

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
