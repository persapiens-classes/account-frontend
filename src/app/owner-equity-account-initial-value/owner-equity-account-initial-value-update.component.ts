import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { createOwnerEquityAccountInitialValue } from './owner-equity-account-initial-value';
import { DetailFieldComponent } from '../field/detail-field.component';
import { NumberFieldComponent } from '../field/number-field.component';
import { BeanUpdatePanelComponent } from '../bean/bean-update-panel.component';
import { OwnerEquityAccountInitialValueUpdateService } from './owner-equity-account-initial-value-update-service';
import { toBeanFromHistory } from '../bean/bean';
import { form, required } from '@angular/forms/signals';

@Component({
  selector: 'app-owner-equity-account-initial-value-update',
  imports: [
    ButtonModule,
    PanelModule,
    CommonModule,
    NumberFieldComponent,
    DetailFieldComponent,
    BeanUpdatePanelComponent,
  ],
  template: `
    <app-bean-update-panel
      [form]="form"
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

      <app-number-field label="Initial Value" [autoFocus]="true" [formField]="form.initialValue" />
    </app-bean-update-panel>
  `,
})
export class OwnerEquityAccountInitialValueUpdateComponent {
  beanFromHistory = toBeanFromHistory(createOwnerEquityAccountInitialValue);
  form = form(signal(this.beanFromHistory), (f) => {
    required(f.initialValue);
  });

  beanUpdateService = inject(OwnerEquityAccountInitialValueUpdateService);

  createBean(): number {
    return this.form().value().initialValue;
  }
}
