import { Component, inject, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OwnerEquityAccountInitialValueInsert } from './owner-equity-account-initial-value';
import { Owner } from '../owner/owner';
import { Account } from '../account/account';
import { SelectFieldComponent } from '../field/select-field.component';
import { NumberFieldComponent } from '../field/number-field.component';
import { OwnerListService } from '../owner/owner-list-service';
import { AccountListService } from '../account/account-list-service';
import { BeanInsertPanelComponent } from '../bean/bean-insert-panel.component';
import { OwnerEquityAccountInitialValueInsertService } from './owner-equity-account-initial-value-insert-service';
import { AppMessageService } from '../app-message-service';

@Component({
  selector: 'app-owner-equity-account-initial-value-insert',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NumberFieldComponent,
    SelectFieldComponent,
    BeanInsertPanelComponent,
  ],
  template: `
    <app-bean-insert-panel
      [formGroup]="formGroup"
      [createBean]="createBean.bind(this)"
      [beanInsertService]="beanInsertService"
      [beanName]="'Balances'"
      [routerName]="'ownerEquityAccountInitialValues'"
    >
      <app-select-field
        label="Owner"
        placeholder="Select owner"
        [autoFocus]="true"
        optionLabel="name"
        [options]="owners()"
        formControlName="selectOwner"
      />

      <app-select-field
        label="Equity Account"
        placeholder="Select equity account"
        optionLabel="description"
        [options]="equityAccounts()"
        formControlName="selectEquityAccount"
      />

      <app-number-field label="Initial Value" formControlName="inputInitialValue" />
    </app-bean-insert-panel>
  `,
})
export class OwnerEquityAccountInitialValueInsertComponent {
  formGroup: FormGroup;
  beanInsertService = inject(OwnerEquityAccountInitialValueInsertService);

  equityAccounts: WritableSignal<Account[]>;
  owners: WritableSignal<Owner[]>;

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      selectOwner: ['', [Validators.required]],
      selectEquityAccount: ['', [Validators.required]],
      inputInitialValue: ['', [Validators.required]],
    });

    this.equityAccounts = new AccountListService(inject(AppMessageService), 'Equity').findAll();
    this.owners = inject(OwnerListService).findAll();
  }

  createBean(): OwnerEquityAccountInitialValueInsert {
    return new OwnerEquityAccountInitialValueInsert(
      this.formGroup.value.selectOwner.name,
      this.formGroup.value.selectEquityAccount.description,
      this.formGroup.value.inputInitialValue,
    );
  }
}
