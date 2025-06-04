import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EntryInsertUpdate } from './entry';
import { BeanInsertComponent } from '../bean/bean-insert.component';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Account } from '../account/account';
import { Owner } from '../owner/owner';
import { DateFieldComponent } from '../field/date-field.component';
import { SelectFieldComponent } from '../field/select-field.component';
import { NumberFieldComponent } from '../field/number-field.component';
import { InputFieldComponent } from '../field/input-field.component';
import { EntryInsertFormGroupService } from './entry-insert-form-group.service';
import { OwnerListService } from '../owner/owner-list-service';
import { AccountListService } from '../account/account-list-service';

@Component({
  selector: 'app-entry-insert',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    DateFieldComponent,
    SelectFieldComponent,
    NumberFieldComponent,
    InputFieldComponent,
  ],
  template: `
    <app-date-field label="Date" [autoFocus]="true" [control]="form.get('inputDate')!" />

    <app-select-field
      label="In Owner"
      placeholder="Select in owner"
      optionLabel="name"
      [options]="(owners$ | async)!"
      [control]="form.get('selectInOwner')!"
    />

    <app-select-field
      label="In Account"
      placeholder="Select in account"
      optionLabel="description"
      [options]="(inAccounts$ | async)!"
      [control]="form.get('selectInAccount')!"
    />

    <app-select-field
      label="Out Owner"
      placeholder="Select out owner"
      optionLabel="name"
      [options]="(owners$ | async)!"
      [control]="form.get('selectOutOwner')!"
    />

    <app-select-field
      label="Out Account"
      placeholder="Select out account"
      optionLabel="description"
      [options]="(outAccounts$ | async)!"
      [control]="form.get('selectOutAccount')!"
    />

    <app-number-field label="Value" [control]="form.get('inputValue')!" />

    <app-input-field label="Note" [control]="form.get('inputNote')!" />
  `,
})
export class EntryInsertComponent extends BeanInsertComponent<EntryInsertUpdate> {
  form: FormGroup;

  inAccounts$: Observable<Account[]>;
  outAccounts$: Observable<Account[]>;
  owners$: Observable<Owner[]>;

  constructor(
    http: HttpClient,
    route: ActivatedRoute,
    entryFormGroupService: EntryInsertFormGroupService,
    ownerService: OwnerListService,
  ) {
    super(createBean);

    this.form = entryFormGroupService.form;

    this.inAccounts$ = new AccountListService(http, route.snapshot.data['inAccountType']).findAll();
    this.outAccounts$ = new AccountListService(
      http,
      route.snapshot.data['outAccountType'],
    ).findAll();
    this.owners$ = ownerService.findAll();
  }
}

function createBean(form: FormGroup): EntryInsertUpdate {
  return new EntryInsertUpdate(
    form.value.selectInOwner.name,
    form.value.selectOutOwner.name,
    form.value.inputDate,
    form.value.selectInAccount.description,
    form.value.selectOutAccount.description,
    form.value.inputValue,
    form.value.inputNote,
  );
}
