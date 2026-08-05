import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Owner } from './owner';
import { DetailFieldComponent } from '../field/detail-field.component';
import { toModelFromHistory } from '../models/models';
import { ModelDetailPanelComponent } from '../models/model-detail-panel.component';

@Component({
  selector: 'app-owner-detail',
  imports: [CommonModule, DetailFieldComponent, ModelDetailPanelComponent],
  template: `
    <app-model-detail-panel [routerName]="'owners'" [model]="model">
      <app-detail-field strong="Name" [value]="model.name" dataCy="detail-name" />
    </app-model-detail-panel>
  `,
})
export class OwnerDetailComponent {
  model: Owner;

  constructor() {
    this.model = toModelFromHistory();
  }
}
