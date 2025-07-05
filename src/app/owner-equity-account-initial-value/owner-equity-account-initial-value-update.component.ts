import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { OwnerEquityAccountInitialValue } from './owner-equity-account-initial-value';
import { BeanUpdateComponent } from '../bean/bean-update.component';
import { DetailFieldComponent } from '../field/detail-field.component';
import { NumberFieldComponent } from '../field/number-field.component';
import { OwnerEquityAccountInitialValueUpdateFormGroupService } from './owner-equity-account-initial-value-update-form-group.service';

@Component({
  selector: 'app-owner-equity-account-initial-value-update',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    PanelModule,
    CommonModule,
    NumberFieldComponent,
    DetailFieldComponent,
  ],
  template: `
    <app-detail-field strong="Owner" value="{{ bean.owner }}" />

    <app-detail-field
      strong="Equity Account"
      value="{{ bean.equityAccount.description }} - {{ bean.equityAccount.category }}"
    />

    <app-number-field
      label="Initial Value"
      [autoFocus]="true"
      [control]="form.get('inputInitialValue')!"
    />
  `,
})
export class OwnerEquityAccountInitialValueUpdateComponent implements BeanUpdateComponent<number> {
  form: FormGroup;
  bean: OwnerEquityAccountInitialValue;

  constructor() {
    const ownerEquityAccountInitialValueFormGroupService = inject(
      OwnerEquityAccountInitialValueUpdateFormGroupService,
    );

    this.form = ownerEquityAccountInitialValueFormGroupService.form;
    this.bean = ownerEquityAccountInitialValueFormGroupService.createBeanFromHistory();
  }

  createBean(form: FormGroup): number {
    return form.value.inputInitialValue;
  }
}
