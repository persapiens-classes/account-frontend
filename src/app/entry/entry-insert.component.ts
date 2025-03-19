import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { AutoFocusModule } from 'primeng/autofocus';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { Entry, EntryInsertUpdate } from './entry';
import { EntryService } from './entry-service';
import { BeanInsertComponent } from '../bean/bean-insert.component';
import { Observable } from 'rxjs';
import { SelectModule } from 'primeng/select';
import { HttpClient } from '@angular/common/http';
import { Account } from '../account/account';
import { Owner } from '../owner/owner';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { AccountService } from '../account/account-service';
import { OwnerService } from '../owner/owner-service';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'account-insert',
  imports: [FloatLabelModule, InputNumberModule, DatePickerModule, AsyncPipe, SelectModule, ReactiveFormsModule, ButtonModule, InputTextModule, PanelModule, AutoFocusModule, CommonModule, TooltipModule],
  template: `
    <form [formGroup]="form">
      <p-panel header="New">
        <p-float-label variant="in" style="margin-bottom: 10px">
          <p-date-picker id="date" 
            name="inputDate"
            [pAutoFocus]="true" 
            [showIcon]="true"
            formControlName="inputDate" />
          <label for="date">Date</label>
        </p-float-label>
        <div *ngIf="form.get('inputDate')?.invalid && (form.get('inputDate')?.dirty || form.get('inputDate')?.touched)"
          class="alert">
          <div *ngIf="form.get('inputDate')?.errors?.['required']">Description is required.</div>
        </div>

        <p-float-label variant="in" style="margin-bottom: 10px">
          <p-select id="inOwner" 
            name="selectInOwner"
            [options]="(owners$ | async)!"
            optionLabel="name"
            placeholder="Select in owner" 
            formControlName="selectInOwner" />
          <label for="inOwner">In Owner</label>
        </p-float-label>

        <p-float-label variant="in" style="margin-bottom: 10px">
          <p-select id="inAccount" 
            name="selectInAccount"
            [options]="(inAccounts$ | async)!"
            optionLabel="description"
            placeholder="Select in account" 
            formControlName="selectInAccount" />
          <label for="inAccount">In Account</label>
        </p-float-label>

        <p-float-label variant="in" style="margin-bottom: 10px">
          <p-select id="outOwner" 
            name="selectOutOwner"
            [options]="(owners$ | async)!"
            optionLabel="name"
            placeholder="Select in owner" 
            formControlName="selectOutOwner" />
          <label for="outOwner">Out Owner</label>
        </p-float-label>

        <p-float-label variant="in" style="margin-bottom: 10px">
          <p-select id="outAccount" 
            name="selectOutAccount"
            [options]="(outAccounts$ | async)!"
            optionLabel="description"
            placeholder="Select out account" 
            formControlName="selectOutAccount" />
          <label for="outAccount">Out Account</label>
        </p-float-label>

        <p-float-label variant="in" style="margin-bottom: 10px">
          <p-inputnumber id="value" 
            name="inputValue"
            mode="currency" currency="USD" locale="en-US"
            placeholder="Input value" 
            formControlName="inputValue" />
          <label for="inputValue">Value</label>
        </p-float-label>

        <p-float-label variant="in" style="margin-bottom: 10px">
          <input id="note" 
            name="inputNote"
            pInputText 
            formControlName="inputNote" />
          <label for="name">Note</label>
        </p-float-label>

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
    inputDate: ['', [Validators.required, Validators.minLength(3)]],
    selectInOwner: ['', [Validators.required, Validators.minLength(3)]],
    selectInAccount: ['', [Validators.required, Validators.minLength(3)]],
    selectOutOwner: ['', [Validators.required, Validators.minLength(3)]],
    selectOutAccount: ['', [Validators.required, Validators.minLength(3)]],
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
