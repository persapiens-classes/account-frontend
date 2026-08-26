import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category, CategorySchema } from './category';
import { DetailFieldComponent } from '../field/detail-field.component';
import { toModelFromHistory } from '../models/models';
import { ActivatedRoute } from '@angular/router';
import { ModelDetailPanelComponent } from '../models/model-detail-panel.component';
import { PATHS } from '../app.paths';

@Component({
  selector: 'app-category-detail',
  imports: [CommonModule, DetailFieldComponent, ModelDetailPanelComponent],
  template: `
    <app-model-detail-panel [routerName]="routerName" [model]="model">
      <app-detail-field
        strong="Description"
        value="{{ model.description }}"
        dataCy="detail-description"
      />
    </app-model-detail-panel>
  `,
})
export class CategoryDetailComponent {
  model: Category;
  routerName: string;
  constructor() {
    const type = inject(ActivatedRoute).snapshot.data['type'];
    this.routerName = `${type.toLowerCase()}${PATHS.CATEGORY_PATH}`;
    this.model = toModelFromHistory<Category>(CategorySchema);
  }
}
