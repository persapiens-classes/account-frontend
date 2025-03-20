import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { AutoFocusModule } from 'primeng/autofocus';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { OwnerEquityAccountInitialValue, OwnerEquityAccountInitialValueInsert } from './ownerEquityAccountInitialValue';
import { OwnerEquityAccountInitialValueService } from './ownerEquityAccountInitialValue-service';
import { BeanInsertComponent } from '../bean/bean-insert.component';
import { Observable } from 'rxjs';
import { Owner } from '../owner/owner';
import { Account } from '../account/account';
import { OwnerService } from '../owner/owner-service';
import { AccountService } from '../account/account-service';
import { HttpClient } from '@angular/common/http';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectField } from "../select-field.component";

@Component({
  selector: 'ownerEquityAccountInitialValue-insert',
  imports: [FloatLabelModule, InputNumberModule, ReactiveFormsModule, ButtonModule, InputTextModule, SelectModule, PanelModule, AutoFocusModule, CommonModule, TooltipModule, SelectField],
  template: `
    <form [formGroup]="form">
      <p-panel header="New">
        <a-select-field label="Owner"
          placeholder="Select owner" 
          [autoFocus]="true"
          optionLabel="name"
          [options]="(owners$ | async)!"
          [control]="form.get('selectOwner')!" />

        <a-select-field label="Equity Account"
          placeholder="Select equity account" 
          optionLabel="description"
          [options]="(equityAccounts$ | async)!"
          [control]="form.get('selectEquityAccount')!" />

        <p-float-label variant="in" class="margin-bottom">
          <p-inputnumber id="value" 
            name="inputValue"
            mode="currency" currency="USD" locale="en-US"
            formControlName="inputValue" />
          <label for="inputValue">Initial Value</label>
        </p-float-label>

        <p-button icon="pi pi-check" (onClick)="insert()" [style]="{'margin-right': '10px'}" [disabled]="form.invalid" pTooltip="Save the owner"/>
        <p-button icon="pi pi-times" (onClick)="cancelInsert()" pTooltip="Cancel"/>
      </p-panel>
    </form>
  `
})
export class OwnerEquityAccountInitialValueInsertComponent extends BeanInsertComponent<OwnerEquityAccountInitialValue, OwnerEquityAccountInitialValueInsert, number> {

  equityAccounts$: Observable<Array<Account>>
  owners$: Observable<Array<Owner>>

  constructor(
    router: Router,
    messageService: MessageService,
    formBuilder: FormBuilder,
    http: HttpClient,
    ownerEquityAccountInitialValueService: OwnerEquityAccountInitialValueService,
    ownerService: OwnerService
  ) {
    super(router, messageService, formBuilder, ownerEquityAccountInitialValueService, createForm, createBean)

    this.equityAccounts$ = new AccountService(http, 'Equity').findAll()
    this.owners$ = ownerService.findAll()
  }

}

function createForm(formBuilder: FormBuilder): FormGroup {
  return formBuilder.group({
    selectOwner: ['', [Validators.required]],
    selectEquityAccount: ['', [Validators.required]],
    inputValue: ['', [Validators.required]]
  })
}

function createBean(form: FormGroup): OwnerEquityAccountInitialValueInsert {
  return new OwnerEquityAccountInitialValueInsert(form.value.selectOwner.name, form.value.selectEquityAccount.description, form.value.inputValue)
}

