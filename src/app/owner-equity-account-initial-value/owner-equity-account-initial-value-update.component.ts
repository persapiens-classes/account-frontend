import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { OwnerEquityAccountInitialValue, OwnerEquityAccountInitialValueInsert } from './owner-equity-account-initial-value';
import { OwnerEquityAccountInitialValueService } from './owner-equity-account-initial-value-service';
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
      [control]="form.get('inputValue')!" />
  `
})
export class OwnerEquityAccountInitialValueUpdateComponent extends BeanUpdateComponent<OwnerEquityAccountInitialValue, OwnerEquityAccountInitialValueInsert, number> {
  form: FormGroup
  bean: OwnerEquityAccountInitialValue

  constructor(ownerEquityAccountInitialValueFormGroupService: OwnerEquityAccountInitialValueUpdateFormGroupService,
    ownerEquityAccountInitialValueService: OwnerEquityAccountInitialValueService
  ) {
    super(ownerEquityAccountInitialValueService)

    this.form = ownerEquityAccountInitialValueFormGroupService.form
    this.bean = ownerEquityAccountInitialValueFormGroupService.createBeanFromHistory()
  }

  createBean(): number {
    return this.form.value.inputValue
  }

}
