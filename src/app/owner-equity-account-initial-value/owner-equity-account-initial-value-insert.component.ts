import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  createOwnerEquityAccountInitialValue,
  OwnerEquityAccountInitialValue,
  OwnerEquityAccountInitialValueInsert,
} from './owner-equity-account-initial-value';
import { Owner } from '../owner/owner';
import { Account, AccountType } from '../account/account';
import { SelectFieldSComponent } from '../field/select-fields.component';
import { NumberFieldSComponent } from '../field/number-fields.component';
import { OwnerListService } from '../owner/owner-list-service';
import { AccountListService } from '../account/account-list-service';
import { BeanInsertPanelsComponent } from '../bean/bean-insert-panels.component';
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
  return new OwnerEquityAccountInitialValueInsert(
    ownerEquityAccountInitialValueForm.owner.name,
    ownerEquityAccountInitialValueForm.equityAccount.description,
    ownerEquityAccountInitialValueForm.initialValue,
  );
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
  imports: [CommonModule, NumberFieldSComponent, SelectFieldSComponent, BeanInsertPanelsComponent],
  template: `
    <app-bean-insert-panels
      [form]="form"
      [createBean]="createBean.bind(this)"
      [beanInsertService]="beanInsertService"
      [beanName]="'Balances'"
      [routerName]="'ownerEquityAccountInitialValues'"
    >
      <app-select-fields
        label="Owner"
        [autoFocus]="true"
        optionLabel="name"
        [options]="owners()"
        [field]="form.owner"
      />

      <app-select-fields
        label="Equity Account"
        optionLabel="description"
        [options]="equityAccounts()"
        [field]="form.equityAccount"
      />

      <app-number-fields label="Initial Value" [field]="form.initialValue" />
    </app-bean-insert-panels>
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
