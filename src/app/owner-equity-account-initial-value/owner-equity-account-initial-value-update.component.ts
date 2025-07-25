import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import {
  createOwnerEquityAccountInitialValue,
  OwnerEquityAccountInitialValue,
} from './owner-equity-account-initial-value';
import { DetailFieldComponent } from '../field/detail-field.component';
import { NumberFieldComponent } from '../field/number-field.component';
import { BeanUpdatePanelComponent } from '../bean/bean-update-panel.component';
import { OwnerEquityAccountInitialValueUpdateService } from './owner-equity-account-initial-value-update-service';
import { toBeanFromHistory } from '../bean/bean';

@Component({
  selector: 'app-owner-equity-account-initial-value-update',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    PanelModule,
    CommonModule,
    NumberFieldComponent,
    DetailFieldComponent,
    BeanUpdatePanelComponent,
  ],
  template: `
    <app-bean-update-panel
      [formGroup]="formGroup"
      [beanFromHistory]="beanFromHistory"
      [createBean]="createBean.bind(this)"
      [beanUpdateService]="beanUpdateService"
      [beanName]="'Balances'"
      [routerName]="'ownerEquityAccountInitialValues'"
    >
      <app-detail-field strong="Owner" value="{{ beanFromHistory.owner }}" />

      <app-detail-field
        strong="Equity Account"
        value="{{ beanFromHistory.equityAccount.description }} - {{
          beanFromHistory.equityAccount.category
        }}"
      />

      <app-number-field
        label="Initial Value"
        [autoFocus]="true"
        formControlName="inputInitialValue"
      />
    </app-bean-update-panel>
  `,
})
export class OwnerEquityAccountInitialValueUpdateComponent {
  formGroup: FormGroup;
  beanFromHistory: OwnerEquityAccountInitialValue;
  beanUpdateService = inject(OwnerEquityAccountInitialValueUpdateService);

  constructor() {
    this.beanFromHistory = toBeanFromHistory(createOwnerEquityAccountInitialValue);
    this.formGroup = inject(FormBuilder).group({
      inputInitialValue: [this.beanFromHistory.initialValue, [Validators.required]],
    });
  }

  createBean(): number {
    return this.formGroup.value.inputInitialValue;
  }
}
