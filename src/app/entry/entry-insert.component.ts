import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { MessageService } from 'primeng/api';
import { Entry, EntryInsertUpdate } from './entry';
import { EntryService } from './entry-service';
import { BeanInsertComponent } from '../bean/bean-insert.component';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Account } from '../account/account';
import { Owner } from '../owner/owner';
import { AccountService } from '../account/account-service';
import { OwnerService } from '../owner/owner-service';
import { DateField } from "../field/date-field.component";
import { SelectField } from "../field/select-field.component";
import { NumberField } from "../field/number-field.component";
import { InputField } from "../field/input-field.component";

@Component({
  selector: 'account-insert',
  imports: [ReactiveFormsModule, ButtonModule, PanelModule, CommonModule, DateField, SelectField, NumberField, InputField],
  template: `
    <form [formGroup]="form">
      <p-panel header="New">
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

        <p-button icon="pi pi-check" (onClick)="insert()" [style]="{'margin-right': '10px'}" [disabled]="form.invalid" pTooltip="Save the credit account"/>
        <p-button icon="pi pi-times" (onClick)="cancelInsert()" pTooltip="Cancel"/>
      </p-panel>
    </form>
  `
})
export class EntryInsertComponent extends BeanInsertComponent<Entry, EntryInsertUpdate, EntryInsertUpdate> {

  inAccounts$: Observable<Array<Account>>
  outAccounts$: Observable<Array<Account>>
  owners$: Observable<Array<Owner>>

  constructor(
    router: Router,
    messageService: MessageService,
    formBuilder: FormBuilder,
    http: HttpClient,
    route: ActivatedRoute,
    ownerService: OwnerService
  ) {
    super(router, messageService, formBuilder, new EntryService(http, route.snapshot.data['type']), createForm, createBean)

    this.inAccounts$ = new AccountService(http, route.snapshot.data['inAccountType']).findAll()
    this.outAccounts$ = new AccountService(http, route.snapshot.data['outAccountType']).findAll()
    this.owners$ = ownerService.findAll()
  }

}

function createForm(formBuilder: FormBuilder): FormGroup {
  return formBuilder.group({
    inputDate: ['', [Validators.required]],
    selectInOwner: ['', [Validators.required]],
    selectInAccount: ['', [Validators.required]],
    selectOutOwner: ['', [Validators.required]],
    selectOutAccount: ['', [Validators.required]],
    inputValue: ['', [Validators.required]],
    inputNote: ['', []]
  })
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
