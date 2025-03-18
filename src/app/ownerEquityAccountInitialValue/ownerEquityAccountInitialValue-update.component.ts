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
import { BeanUpdateComponent } from '../bean/bean-update.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { Owner } from '../owner/owner';
import { Account } from '../account/account';

@Component({
  selector: 'ownerEquityAccountInitialValue-edit',
  imports: [InputNumberModule, ReactiveFormsModule, ButtonModule, InputTextModule, PanelModule, AutoFocusModule, DividerModule, CommonModule, TooltipModule],
  template: `
    <form [formGroup]="form">
      <p-panel header="Edit">
      <div style="margin-bottom: 10px">
          <label for="owner">Owner:</label>
          {{ bean.owner }}
        </div>

        <div style="margin-bottom: 10px">
          <label for="equityAccount">Equity Account:</label>
          {{ bean.equityAccount.description }} - {{ bean.equityAccount.category }}
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
    inputOwner: [new Owner(bean.owner), [Validators.required, Validators.minLength(3)]],
    inputEquityAccount: [new Account(bean.equityAccount.description, bean.equityAccount.category), [Validators.required, Validators.minLength(3)]],
    inputValue: [bean.value, [Validators.required]]
  })
}

function createBean(form: FormGroup): number {
  return form.value.inputValue
}
