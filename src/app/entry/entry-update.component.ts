import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { Entry, EntryInsertUpdate } from './entry';
import { EntryService } from './entry-service';
import { BeanUpdateComponent } from '../bean/bean-update.component';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Account } from '../account/account';
import { Owner } from '../owner/owner';
import { AccountService } from '../account/account-service';
import { OwnerService } from '../owner/owner-service';
import { InputField } from '../field/input-field.component';
import { NumberField } from '../field/number-field.component';
import { SelectField } from '../field/select-field.component';
import { DateField } from '../field/date-field.component';
import { EntryUpdateFormGroupService } from './entry-update-form-group.service';

@Component({
  selector: 'entry-update',
  imports: [ReactiveFormsModule, ButtonModule, PanelModule, CommonModule, DateField, SelectField, NumberField, InputField],
  template: `
    <a-date-field label="Date"
      [autoFocus]="true"
      [control]="form.get('inputDate')!" />

    <a-select-field label="In Owner"
      placeholder="Select in owner" 
      optionLabel="name"
      [options]="(owners$ | async)!"
      [control]="form.get('selectInOwner')!" />

    <a-select-field label="In Account"
      placeholder="Select in account" 
      optionLabel="description"
      [options]="(inAccounts$ | async)!"
      [control]="form.get('selectInAccount')!" />

    <a-select-field label="Out Owner"
      placeholder="Select out owner" 
      optionLabel="name"
      [options]="(owners$ | async)!"
      [control]="form.get('selectOutOwner')!" />

    <a-select-field label="Out Account"
      placeholder="Select out account" 
      optionLabel="description"
      [options]="(outAccounts$ | async)!"
      [control]="form.get('selectOutAccount')!" />

    <a-number-field label="Value"
      [control]="form.get('inputValue')!" />

    <a-input-field label="Note" 
      [control]="form.get('inputNote')!" />
  `
})
export class EntryUpdateComponent extends BeanUpdateComponent<Entry, EntryInsertUpdate, EntryInsertUpdate> {
  form: FormGroup

  inAccounts$: Observable<Array<Account>>
  outAccounts$: Observable<Array<Account>>
  owners$: Observable<Array<Owner>>

  constructor(entryFormGroupService: EntryUpdateFormGroupService,
    http: HttpClient,
    route: ActivatedRoute,
    ownerService: OwnerService
  ) {
    super(new EntryService(http, route.snapshot.data['type']), createBean)

    this.form = entryFormGroupService.form

    this.inAccounts$ = new AccountService(http, route.snapshot.data['inAccountType']).findAll()
    this.outAccounts$ = new AccountService(http, route.snapshot.data['outAccountType']).findAll()
    this.owners$ = ownerService.findAll()
  }

}

function createBean(form: FormGroup): EntryInsertUpdate {
  return new EntryInsertUpdate(form.value.selectInOwner.name,
    form.value.selectOutOwner.name,
    form.value.inputDate,
    form.value.selectInAccount.description,
    form.value.selectOutAccount.description,
    form.value.inputValue,
    form.value.inputNote
  )
}
