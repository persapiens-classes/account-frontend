import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OwnerEquityAccountInitialValueInsert } from './owner-equity-account-initial-value';
import { BeanInsertComponent } from '../bean/bean-insert.component';
import { Observable } from 'rxjs';
import { Owner } from '../owner/owner';
import { Account } from '../account/account';
import { HttpClient } from '@angular/common/http';
import { SelectFieldComponent } from '../field/select-field.component';
import { NumberFieldComponent } from '../field/number-field.component';
import { OwnerEquityAccountInitialValueInsertFormGroupService } from './owner-equity-account-initial-value-insert-form-group.service';
import { OwnerListService } from '../owner/owner-list-service';
import { AccountListService } from '../account/account-list-service';

@Component({
  selector: 'app-owner-equity-account-initial-value-insert',
  imports: [ReactiveFormsModule, CommonModule, NumberFieldComponent, SelectFieldComponent],
  template: `
    <app-select-field
      label="Owner"
      placeholder="Select owner"
      [autoFocus]="true"
      optionLabel="name"
      [options]="(owners$ | async)!"
      [control]="form.get('selectOwner')!"
    />

    <app-select-field
      label="Equity Account"
      placeholder="Select equity account"
      optionLabel="description"
      [options]="(equityAccounts$ | async)!"
      [control]="form.get('selectEquityAccount')!"
    />

    <app-number-field label="Initial Value" [control]="form.get('inputInitialValue')!" />
  `,
})
export class OwnerEquityAccountInitialValueInsertComponent
  implements BeanInsertComponent<OwnerEquityAccountInitialValueInsert>
{
  form: FormGroup;

  equityAccounts$: Observable<Account[]>;
  owners$: Observable<Owner[]>;

  constructor() {
    this.form = inject(OwnerEquityAccountInitialValueInsertFormGroupService).getForm();

    this.equityAccounts$ = new AccountListService(inject(HttpClient), 'Equity').findAll();
    this.owners$ = inject(OwnerListService).findAll();
  }

  createBean(form: FormGroup): OwnerEquityAccountInitialValueInsert {
    return new OwnerEquityAccountInitialValueInsert(
      form.value.selectOwner.name,
      form.value.selectEquityAccount.description,
      form.value.inputInitialValue,
    );
  }
}
