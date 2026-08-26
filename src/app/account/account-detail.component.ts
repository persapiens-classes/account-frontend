import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Account, AccountSchema } from './account';
import { DetailFieldComponent } from '../field/detail-field.component';
import { toModelFromHistory } from '../models/models';
import { ActivatedRoute } from '@angular/router';
import { ModelDetailPanelComponent } from '../models/model-detail-panel.component';
import { PATHS } from '../app.paths';

@Component({
  selector: 'app-account-detail',
  imports: [CommonModule, DetailFieldComponent, ModelDetailPanelComponent],
  template: `
    <app-model-detail-panel [routerName]="routerName" [model]="model">
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
  model: Account;
  routerName: string;
  constructor() {
    const type = inject(ActivatedRoute).snapshot.data['type'];
    this.routerName = `${type.toLowerCase()}${PATHS.ACCOUNT_PATH}`;
    this.model = toModelFromHistory(AccountSchema);
  }
}
