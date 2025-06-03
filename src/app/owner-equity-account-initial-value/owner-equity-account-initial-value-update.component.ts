import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { OwnerEquityAccountInitialValue } from './owner-equity-account-initial-value';
import { BeanUpdateComponent } from '../bean/bean-update.component';
import { DetailField } from "../field/detail-field.component";
import { NumberField } from "../field/number-field.component";
import { OwnerEquityAccountInitialValueUpdateFormGroupService } from './owner-equity-account-initial-value-update-form-group.service';

@Component({
  selector: 'owner-equity-account-initial-value-update',
  imports: [ReactiveFormsModule, ButtonModule, PanelModule, CommonModule, NumberField, DetailField],
  template: `
    <a-detail-field strong="Owner" value="{{ bean.owner }}"/>

    <a-detail-field strong="Equity Account" value="{{ bean.equityAccount.description }} - {{ bean.equityAccount.category }}"/>

    <a-number-field label="Initial Value"
      [autoFocus]="true"
      [control]="form.get('inputInitialValue')!" />
  `
})
export class OwnerEquityAccountInitialValueUpdateComponent extends BeanUpdateComponent<number> {
  form: FormGroup
  bean: OwnerEquityAccountInitialValue

  constructor(ownerEquityAccountInitialValueFormGroupService: OwnerEquityAccountInitialValueUpdateFormGroupService
  ) {
    super(createBean)

    this.form = ownerEquityAccountInitialValueFormGroupService.form
    this.bean = ownerEquityAccountInitialValueFormGroupService.createBeanFromHistory()
  }

}

function createBean(form: FormGroup): number {
  return form.value.inputInitialValue
}
