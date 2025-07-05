import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { EntryInsertUpdate } from './entry';
import { BeanUpdateComponent } from '../bean/bean-update.component';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Account } from '../account/account';
import { Owner } from '../owner/owner';
import { InputFieldComponent } from '../field/input-field.component';
import { NumberFieldComponent } from '../field/number-field.component';
import { SelectFieldComponent } from '../field/select-field.component';
import { DateFieldComponent } from '../field/date-field.component';
import { EntryUpdateFormGroupService } from './entry-update-form-group.service';
import { AccountListService } from '../account/account-list-service';
import { OwnerListService } from '../owner/owner-list-service';
import { EntryInsertComponent } from './entry-insert.component';

@Component({
  selector: 'app-entry-update',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    PanelModule,
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
export class EntryUpdateComponent implements BeanUpdateComponent<EntryInsertUpdate> {
  form: FormGroup;

  inAccounts$: Observable<Account[]>;
  outAccounts$: Observable<Account[]>;
  owners$: Observable<Owner[]>;

  constructor() {
    this.form = inject(EntryUpdateFormGroupService).form;

    const http = inject(HttpClient);
    const route = inject(ActivatedRoute);
    this.inAccounts$ = new AccountListService(http, route.snapshot.data['inAccountType']).findAll();
    this.outAccounts$ = new AccountListService(
      http,
      route.snapshot.data['outAccountType'],
    ).findAll();
    this.owners$ = inject(OwnerListService).findAll();
  }

  createBean(form: FormGroup): EntryInsertUpdate {
    return new EntryInsertComponent().createBean(form);
  }
}
