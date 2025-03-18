import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { AutoFocusModule } from 'primeng/autofocus';
import { DividerModule } from 'primeng/divider';
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

@Component({
  selector: 'ownerEquityAccountInitialValue-insert',
  imports: [InputNumberModule, ReactiveFormsModule, ButtonModule, InputTextModule, SelectModule, PanelModule, AutoFocusModule, DividerModule, CommonModule, TooltipModule],
  template: `
    <form [formGroup]="form">
      <p-panel header="New">

        <div style="margin-bottom: 10px">
          <label for="owner">Owner:</label>
          <p-select id="owner" 
            name="selectOwner"
            [options]="(owners$ | async)!"
            optionLabel="name"
            placeholder="Select owner" 
            formControlName="selectOwner" />
        </div>

        <div style="margin-bottom: 10px">
          <label for="equityAccount">Equity Account:</label>
          <p-select id="equityAccount" 
            name="selectEquityAccount"
            [options]="(equityAccounts$ | async)!"
            optionLabel="description"
            placeholder="Select equity account" 
            formControlName="selectEquityAccount" />
        </div>

        <div style="margin-bottom: 10px">
          <label for="inputValue">Value:</label>
          <p-inputnumber id="value" 
            name="inputValue"
            mode="currency" currency="USD" locale="en-US"
            placeholder="Input value" 
            formControlName="inputValue" />
        </div>

        <p-divider />
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
  let result = new OwnerEquityAccountInitialValueInsert(form.value.selectOwner.name, form.value.selectEquityAccount.description, form.value.inputValue)
  console.log(result)
  return result
}

