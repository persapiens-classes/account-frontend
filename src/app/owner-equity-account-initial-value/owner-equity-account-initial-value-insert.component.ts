import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OwnerEquityAccountInitialValueInsert } from './owner-equity-account-initial-value';
import { BeanInsertComponent } from '../bean/bean-insert.component';
import { Observable } from 'rxjs';
import { Owner } from '../owner/owner';
import { Account } from '../account/account';
import { HttpClient } from '@angular/common/http';
import { SelectField } from '../field/select-field.component';
import { NumberField } from '../field/number-field.component';
import { OwnerEquityAccountInitialValueInsertFormGroupService } from './owner-equity-account-initial-value-insert-form-group.service';
import { OwnerListService } from '../owner/owner-list-service';
import { AccountListService } from '../account/account-list-service';

@Component({
  selector: 'owner-equity-account-initial-value-insert',
  imports: [ReactiveFormsModule, CommonModule, NumberField, SelectField],
  template: `
    <a-select-field
      label="Owner"
      placeholder="Select owner"
      [autoFocus]="true"
      optionLabel="name"
      [options]="(owners$ | async)!"
      [control]="form.get('selectOwner')!"
    />

    <a-select-field
      label="Equity Account"
      placeholder="Select equity account"
      optionLabel="description"
      [options]="(equityAccounts$ | async)!"
      [control]="form.get('selectEquityAccount')!"
    />

    <a-number-field label="Initial Value" [control]="form.get('inputInitialValue')!" />
  `,
})
export class OwnerEquityAccountInitialValueInsertComponent extends BeanInsertComponent<OwnerEquityAccountInitialValueInsert> {
  form: FormGroup;

  equityAccounts$: Observable<Array<Account>>;
  owners$: Observable<Array<Owner>>;

  constructor(
    http: HttpClient,
    ownerEquityAccountInitialValueFormGroupService: OwnerEquityAccountInitialValueInsertFormGroupService,
    ownerService: OwnerListService,
  ) {
    super(createBean);

    this.form = ownerEquityAccountInitialValueFormGroupService.form;

    this.equityAccounts$ = new AccountListService(http, 'Equity').findAll();
    this.owners$ = ownerService.findAll();
  }
}

function createBean(form: FormGroup): OwnerEquityAccountInitialValueInsert {
  return new OwnerEquityAccountInitialValueInsert(
    form.value.selectOwner.name,
    form.value.selectEquityAccount.description,
    form.value.inputInitialValue,
  );
}
