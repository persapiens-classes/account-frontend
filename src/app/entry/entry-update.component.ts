import { Component, inject, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { createEntry, Entry, EntryInsertUpdate, jsonToEntry } from './entry';
import { HttpClient } from '@angular/common/http';
import { Account } from '../account/account';
import { Owner } from '../owner/owner';
import { InputFieldComponent } from '../field/input-field.component';
import { NumberFieldComponent } from '../field/number-field.component';
import { SelectFieldComponent } from '../field/select-field.component';
import { DateFieldComponent } from '../field/date-field.component';
import { AccountListService } from '../account/account-list-service';
import { OwnerListService } from '../owner/owner-list-service';
import { EntryInsertComponent } from './entry-insert.component';
import { BeanUpdatePanelComponent } from '../bean/bean-update-panel.component';
import { EntryUpdateService } from './entry-update-service';
import { toBeanFromHistory } from '../bean/bean';
import { AppMessageService } from '../app-message-service';

@Component({
  selector: 'app-entry-update',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    PanelModule,
    CommonModule,
    DateFieldComponent,
    SelectFieldComponent,
    NumberFieldComponent,
    InputFieldComponent,
    BeanUpdatePanelComponent,
  ],
  template: `
    <app-bean-update-panel
      [formGroup]="formGroup"
      [beanFromHistory]="beanFromHistory"
      [createBean]="createBean.bind(this)"
      [beanUpdateService]="beanUpdateService"
      [beanName]="beanName"
      [routerName]="routerName"
    >
      <app-date-field label="Date" [autoFocus]="true" formControlName="inputDate" />

      <app-select-field
        label="In Owner"
        optionLabel="name"
        [options]="owners()"
        formControlName="selectInOwner"
      />

      <app-select-field
        label="In Account"
        optionLabel="description"
        [options]="inAccounts()"
        formControlName="selectInAccount"
      />

      <app-select-field
        label="Out Owner"
        optionLabel="name"
        [options]="owners()"
        formControlName="selectOutOwner"
      />

      <app-select-field
        label="Out Account"
        optionLabel="description"
        [options]="outAccounts()"
        formControlName="selectOutAccount"
      />

      <app-number-field label="Value" formControlName="inputValue" />

      <app-input-field label="Note" formControlName="inputNote" />
    </app-bean-update-panel>
  `,
})
export class EntryUpdateComponent {
  formGroup: FormGroup;
  beanFromHistory: Entry;
  routerName: string;
  beanName: string;
  beanUpdateService: EntryUpdateService;

  inAccounts: WritableSignal<Account[]>;
  outAccounts: WritableSignal<Account[]>;
  owners: WritableSignal<Owner[]>;

  constructor() {
    this.beanFromHistory = toBeanFromHistory(createEntry, jsonToEntry);

    this.formGroup = inject(FormBuilder).group({
      inputDate: [this.beanFromHistory.date, [Validators.required, Validators.minLength(3)]],
      selectInOwner: [new Owner(this.beanFromHistory.inOwner), [Validators.required]],
      selectInAccount: [
        new Account(
          this.beanFromHistory.inAccount.description,
          this.beanFromHistory.inAccount.category,
        ),
        [Validators.required],
      ],
      selectOutOwner: [new Owner(this.beanFromHistory.outOwner), [Validators.required]],
      selectOutAccount: [
        new Account(
          this.beanFromHistory.outAccount.description,
          this.beanFromHistory.outAccount.category,
        ),
        [Validators.required],
      ],
      inputValue: [this.beanFromHistory.value, [Validators.required, Validators.minLength(3)]],
      inputNote: [this.beanFromHistory.note, [Validators.required, Validators.minLength(3)]],
    });

    const http = inject(HttpClient);
    const activatedRoute = inject(ActivatedRoute);
    const type = activatedRoute.snapshot.data['type'];
    this.routerName = `${type.toLowerCase()}Entries`;
    this.beanName = `${type} Entry`;
    this.beanUpdateService = new EntryUpdateService(http, type);

    this.outAccounts = new AccountListService(
      inject(AppMessageService),
      activatedRoute.snapshot.data['outAccountType'],
    ).findAll();
    this.inAccounts = new AccountListService(
      inject(AppMessageService),
      activatedRoute.snapshot.data['inAccountType'],
    ).findAll();
    this.owners = inject(OwnerListService).findAll();
  }

  createBean(): EntryInsertUpdate {
    return new EntryInsertComponent().createBean();
  }
}
