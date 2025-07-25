import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EntryInsertUpdate } from './entry';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Account } from '../account/account';
import { Owner } from '../owner/owner';
import { DateFieldComponent } from '../field/date-field.component';
import { SelectFieldComponent } from '../field/select-field.component';
import { NumberFieldComponent } from '../field/number-field.component';
import { InputFieldComponent } from '../field/input-field.component';
import { OwnerListService } from '../owner/owner-list-service';
import { AccountListService } from '../account/account-list-service';
import { EntryInsertService } from './entry-insert-service';
import { BeanInsertPanelComponent } from '../bean/bean-insert-panel.component';

@Component({
  selector: 'app-entry-insert',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    DateFieldComponent,
    SelectFieldComponent,
    NumberFieldComponent,
    InputFieldComponent,
    BeanInsertPanelComponent,
  ],
  template: `
    <app-bean-insert-panel
      [formGroup]="formGroup"
      [createBean]="createBean.bind(this)"
      [beanInsertService]="beanInsertService"
      [beanName]="beanName"
      [routerName]="routerName"
    >
      <app-date-field label="Date" [autoFocus]="true" formControlName="inputDate" />

      <app-select-field
        label="In Owner"
        placeholder="Select in owner"
        optionLabel="name"
        [options]="(owners$ | async)!"
        formControlName="selectInOwner"
      />

      <app-select-field
        label="In Account"
        placeholder="Select in account"
        optionLabel="description"
        [options]="(inAccounts$ | async)!"
        formControlName="selectInAccount"
      />

      <app-select-field
        label="Out Owner"
        placeholder="Select out owner"
        optionLabel="name"
        [options]="(owners$ | async)!"
        formControlName="selectOutOwner"
      />

      <app-select-field
        label="Out Account"
        placeholder="Select out account"
        optionLabel="description"
        [options]="(outAccounts$ | async)!"
        formControlName="selectOutAccount"
      />

      <app-number-field label="Value" formControlName="inputValue" />

      <app-input-field label="Note" formControlName="inputNote" />
    </app-bean-insert-panel>
  `,
})
export class EntryInsertComponent {
  formGroup: FormGroup;
  routerName: string;
  beanName: string;
  beanInsertService: EntryInsertService;

  inAccounts$: Observable<Account[]>;
  outAccounts$: Observable<Account[]>;
  owners$: Observable<Owner[]>;

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      inputDate: ['', [Validators.required]],
      selectInOwner: ['', [Validators.required]],
      selectInAccount: ['', [Validators.required]],
      selectOutOwner: ['', [Validators.required]],
      selectOutAccount: ['', [Validators.required]],
      inputValue: ['', [Validators.required]],
      inputNote: ['', []],
    });

    const activatedRoute = inject(ActivatedRoute);
    const type = activatedRoute.snapshot.data['type'];
    this.routerName = `${type.toLowerCase()}Entries`;
    this.beanName = `${type} Entry`;
    const http = inject(HttpClient);
    this.beanInsertService = new EntryInsertService(http, type);

    this.inAccounts$ = new AccountListService(
      http,
      activatedRoute.snapshot.data['inAccountType'],
    ).findAll();
    this.outAccounts$ = new AccountListService(
      http,
      activatedRoute.snapshot.data['outAccountType'],
    ).findAll();
    this.owners$ = inject(OwnerListService).findAll();
  }

  createBean(): EntryInsertUpdate {
    return new EntryInsertUpdate(
      this.formGroup.value.selectInOwner.name,
      this.formGroup.value.selectOutOwner.name,
      this.formGroup.value.inputDate,
      this.formGroup.value.selectInAccount.description,
      this.formGroup.value.selectOutAccount.description,
      this.formGroup.value.inputValue,
      this.formGroup.value.inputNote,
    );
  }
}
