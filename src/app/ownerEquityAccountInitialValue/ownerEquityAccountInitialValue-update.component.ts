import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { MessageService } from 'primeng/api';
import { OwnerEquityAccountInitialValue, OwnerEquityAccountInitialValueInsert } from './ownerEquityAccountInitialValue';
import { OwnerEquityAccountInitialValueService } from './ownerEquityAccountInitialValue-service';
import { BeanUpdateComponent } from '../bean/bean-update.component';
import { DetailField } from "../field/detail-field.component";
import { NumberField } from "../field/number-field.component";
import { SelectField } from '../field/select-field.component';

@Component({
  selector: 'ownerEquityAccountInitialValue-edit',
  imports: [ReactiveFormsModule, ButtonModule, PanelModule, CommonModule, NumberField, DetailField],
  template: `
    <form [formGroup]="form">
      <p-panel header="Edit">
        <a-detail-field strong="Owner" value="{{ bean.owner }}"/>

        <a-detail-field strong="Equity Account" value="{{ bean.equityAccount.description }} - {{ bean.equityAccount.category }}"/>

        <a-number-field label="Initial Value"
          [autoFocus]="true"
          [control]="form.get('inputValue')!" />

        <p-button icon="pi pi-check" (onClick)="update()" [style]="{'margin-right': '10px'}" [disabled]="form.invalid" pTooltip="Save the owner"/>
        <p-button icon="pi pi-times" (onClick)="cancelUpdate()" pTooltip="Cancel"/>
      </p-panel>
    </form>
  `
})
export class OwnerEquityAccountInitialValueUpdateComponent extends BeanUpdateComponent<OwnerEquityAccountInitialValue, OwnerEquityAccountInitialValueInsert, number> {

  constructor(
    router: Router,
    messageService: MessageService,
    formBuilder: FormBuilder,
    ownerService: OwnerEquityAccountInitialValueService
  ) {
    super(router, messageService, formBuilder, ownerService, createForm, createBean)
  }

}

function createForm(formBuilder: FormBuilder, bean: OwnerEquityAccountInitialValue): FormGroup {
  return formBuilder.group({
    inputValue: [bean.value, [Validators.required]]
  })
}

function createBean(form: FormGroup): number {
  return form.value.inputValue
}
