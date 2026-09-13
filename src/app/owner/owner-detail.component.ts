import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailFieldComponent } from '../field/detail-field.component';
import { ModelDetailPanelComponent } from '../models/model-detail-panel.component';
import { PATHS } from '../app.paths';
import { OwnerStateTransferService } from '../models/models-state-transfer-service';

@Component({
  selector: 'app-owner-detail',
  imports: [CommonModule, DetailFieldComponent, ModelDetailPanelComponent],
  template: `
    <app-model-detail-panel
      [routerName]="routerName"
      [model]="model"
      [stateTransferService]="stateTransferService"
    >
      <app-detail-field strong="Name" [value]="model.name" dataCy="detail-name" />
    </app-model-detail-panel>
  `,
})
export class OwnerDetailComponent {
  routerName = PATHS.OWNER_PATH;
  stateTransferService = inject(OwnerStateTransferService);
  model = this.stateTransferService.getState();
}
