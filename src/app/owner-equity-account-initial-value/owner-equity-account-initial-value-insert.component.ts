import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  createOwnerEquityAccountInitialValue,
  OwnerEquityAccountInitialValue,
  OwnerEquityAccountInitialValueInsert,
} from './owner-equity-account-initial-value';
import { Owner } from '../owner/owner';
import { Account, AccountType } from '../account/account';
import { SelectFieldComponent } from '../field/select-field.component';
import { NumberFieldComponent } from '../field/number-field.component';
import { OwnerListService } from '../owner/owner-list-service';
import { AccountListService } from '../account/account-list-service';
import { BeanInsertPanelComponent } from '../bean/bean-insert-panel.component';
import { OwnerEquityAccountInitialValueInsertService } from './owner-equity-account-initial-value-insert-service';
import { AppMessageService } from '../app-message-service';
import { form, required } from '@angular/forms/signals';

export interface OwnerEquityAccountInitialValueForm {
  owner: Owner;
  equityAccount: Account;
  initialValue: number;
}

export function ownerEquityAccountInitialValueFormToModel(
  ownerEquityAccountInitialValueForm: OwnerEquityAccountInitialValueForm,
): OwnerEquityAccountInitialValueInsert {
  return {
    owner: ownerEquityAccountInitialValueForm.owner.name,
    equityAccount: ownerEquityAccountInitialValueForm.equityAccount.description,
    initialValue: ownerEquityAccountInitialValueForm.initialValue,
  };
}

export function ownerEquityAccountInitialValueModelToForm(
  ownerEquityAccountInitialValue: OwnerEquityAccountInitialValue,
): OwnerEquityAccountInitialValueForm {
  return {
    owner: new Owner(ownerEquityAccountInitialValue.owner),
    equityAccount: ownerEquityAccountInitialValue.equityAccount,
    initialValue: ownerEquityAccountInitialValue.initialValue,
  };
}

@Component({
  selector: 'app-owner-equity-account-initial-value-insert',
  imports: [CommonModule, NumberFieldComponent, SelectFieldComponent, BeanInsertPanelComponent],
  template: `
    <app-bean-insert-panel
      [form]="form"
      [createBean]="createBean.bind(this)"
      [beanInsertService]="beanInsertService"
      [beanName]="'Balances'"
      [routerName]="'ownerEquityAccountInitialValues'"
    >
      <app-select-field
        label="Owner"
        [autoFocus]="true"
        optionLabel="name"
        [options]="owners()"
        [field]="form.owner"
        dataCy="select-owner"
      />

      <app-select-field
        label="Equity Account"
        optionLabel="description"
        [options]="equityAccounts()"
        [field]="form.equityAccount"
        dataCy="select-equity-account"
      />

      <app-number-field
        label="Initial Value"
        [field]="form.initialValue"
        dataCy="input-initial-value"
      />
    </app-bean-insert-panel>
  `,
})
export class OwnerEquityAccountInitialValueInsertComponent {
  form = form(
    signal(ownerEquityAccountInitialValueModelToForm(createOwnerEquityAccountInitialValue())),
    (f) => {
      required(f.owner);
      required(f.equityAccount);
      required(f.initialValue);
    },
  );

  beanInsertService = inject(OwnerEquityAccountInitialValueInsertService);

  equityAccounts: WritableSignal<Account[]>;
  owners: WritableSignal<Owner[]>;

  constructor() {
    this.equityAccounts = new AccountListService(
      inject(AppMessageService),
      AccountType.EQUITY,
    ).findAll();
    this.owners = inject(OwnerListService).findAll();
  }

  createBean(): OwnerEquityAccountInitialValueInsert {
    return ownerEquityAccountInitialValueFormToModel(this.form().value());
  }
}
