import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Owner, OwnerSchema } from './owner';
import { DetailFieldComponent } from '../field/detail-field.component';
import { toModelFromHistory } from '../models/models';
import { ModelDetailPanelComponent } from '../models/model-detail-panel.component';
import { PATHS } from '../app.paths';

@Component({
  selector: 'app-owner-detail',
  imports: [CommonModule, DetailFieldComponent, ModelDetailPanelComponent],
  template: `
    <app-model-detail-panel [routerName]="routerName" [model]="model">
      <app-detail-field strong="Name" [value]="model.name" dataCy="detail-name" />
    </app-model-detail-panel>
  `,
})
export class OwnerDetailComponent {
  routerName = PATHS.OWNER_PATH;
  model: Owner;

  constructor() {
    this.model = toModelFromHistory(OwnerSchema);
  }
}
