import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailFieldComponent } from '../field/detail-field.component';
import { ActivatedRoute } from '@angular/router';
import { ModelDetailPanelComponent } from '../models/model-detail-panel.component';
import { PATHS } from '../app.paths';
import { AccountStateTransferService } from '../models/models-state-transfer-service';

@Component({
  selector: 'app-account-detail',
  imports: [CommonModule, DetailFieldComponent, ModelDetailPanelComponent],
  template: `
    <app-model-detail-panel
      [routerName]="routerName"
      [model]="model"
      [stateTransferService]="stateTransferService"
    >
      <app-detail-field
        strong="Description"
        value="{{ model.description }}"
        dataCy="detail-description"
      />
      <app-detail-field strong="Category" value="{{ model.category }}" dataCy="detail-category" />
    </app-model-detail-panel>
  `,
})
export class AccountDetailComponent {
  stateTransferService = inject(AccountStateTransferService);
  model = this.stateTransferService.getState();
  private readonly type = inject(ActivatedRoute).snapshot.data['type'];
  routerName = `${this.type.toLowerCase()}${PATHS.ACCOUNT_PATH}`;
}
