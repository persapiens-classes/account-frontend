import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '@openng/optimus-ui/button';
import { PanelModule } from '@openng/optimus-ui/panel';
import {
  OwnerEquityAccountInitialValue,
  ownerEquityAccountInitialValueId,
  OwnerEquityAccountInitialValueSchema,
} from './owner-equity-account-initial-value';
import { DetailFieldComponent } from '../field/detail-field.component';
import { NumberFieldComponent } from '../field/number-field.component';
import { ModelUpdatePanelComponent } from '../models/model-update-panel.component';
import { OwnerEquityAccountInitialValueUpdateService } from './owner-equity-account-initial-value-update-service';
import { toModelFromHistory } from '../models/models';
import { form, required } from '@angular/forms/signals';

@Component({
  selector: 'app-owner-equity-account-initial-value-update',
  imports: [
    ButtonModule,
    PanelModule,
    CommonModule,
    NumberFieldComponent,
    DetailFieldComponent,
    ModelUpdatePanelComponent,
  ],
  template: `
    <app-model-update-panel
      [form]="form"
      [modelFromHistory]="modelFromHistory"
      [modelIdFn]="modelIdFn"
      [createModel]="createModel.bind(this)"
      [modelUpdateService]="modelUpdateService"
      [modelName]="'Balances'"
      [routerName]="'ownerEquityAccountInitialValues'"
    >
      <app-detail-field strong="Owner" value="{{ modelFromHistory.owner }}" />

      <app-detail-field
        strong="Equity Account"
        value="{{ modelFromHistory.equityAccount.description }} - {{
          modelFromHistory.equityAccount.category
        }}"
      />

      <app-number-field label="Initial Value" [autoFocus]="true" [formField]="form.initialValue" />
    </app-model-update-panel>
  `,
})
export class OwnerEquityAccountInitialValueUpdateComponent {
  modelFromHistory = toModelFromHistory<OwnerEquityAccountInitialValue>(
    OwnerEquityAccountInitialValueSchema,
  );
  form = form(signal(this.modelFromHistory), (f) => {
    required(f.initialValue);
  });

  modelUpdateService = inject(OwnerEquityAccountInitialValueUpdateService);
  modelIdFn = ownerEquityAccountInitialValueId;

  createModel(): number {
    return this.form().value().initialValue;
  }
}
