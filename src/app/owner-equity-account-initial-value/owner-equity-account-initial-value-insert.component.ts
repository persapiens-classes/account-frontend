import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OwnerEquityAccountInitialValue, OwnerEquityAccountInitialValueInsert } from './owner-equity-account-initial-value';
import { OwnerEquityAccountInitialValueService } from './owner-equity-account-initial-value-service';
import { BeanInsertComponent } from '../bean/bean-insert.component';
import { Observable } from 'rxjs';
import { Owner } from '../owner/owner';
import { Account } from '../account/account';
import { OwnerService } from '../owner/owner-service';
import { AccountService } from '../account/account-service';
import { HttpClient } from '@angular/common/http';
import { SelectField } from "../field/select-field.component";
import { NumberField } from "../field/number-field.component";
import { OwnerEquityAccountInitialValueInsertFormGroupService } from './owner-equity-account-initial-value-insert-form-group.service';

@Component({
  selector: 'owner-equity-account-initial-value-insert',
  imports: [ReactiveFormsModule, CommonModule, NumberField, SelectField],
  template: `
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

    <a-number-field label="Initial Value"
      [control]="form.get('inputValue')!" />
  `
})
export class OwnerEquityAccountInitialValueInsertComponent extends BeanInsertComponent<OwnerEquityAccountInitialValue, OwnerEquityAccountInitialValueInsert, number> {
  form: FormGroup

  equityAccounts$: Observable<Array<Account>>
  owners$: Observable<Array<Owner>>

  constructor(
    http: HttpClient,
    ownerEquityAccountInitialValueFormGroupService: OwnerEquityAccountInitialValueInsertFormGroupService,
    ownerEquityAccountInitialValueService: OwnerEquityAccountInitialValueService,
    ownerService: OwnerService
  ) {
    super(ownerEquityAccountInitialValueService)

    this.form = ownerEquityAccountInitialValueFormGroupService.form

    this.equityAccounts$ = new AccountService(http, 'Equity').findAll()
    this.owners$ = ownerService.findAll()
  }

  createBean(): OwnerEquityAccountInitialValueInsert {
    return new OwnerEquityAccountInitialValueInsert(this.form.value.selectOwner.name,
      this.form.value.selectEquityAccount.description,
      this.form.value.inputValue)
  }

}

