import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Account } from './account';
import { DetailFieldComponent } from '../field/detail-field.component';
import { toModelFromHistory } from '../models/models';
import { ActivatedRoute } from '@angular/router';
import { ModelDetailPanelComponent } from '../models/model-detail-panel.component';

@Component({
  selector: 'app-account-detail',
  imports: [CommonModule, DetailFieldComponent, ModelDetailPanelComponent],
  template: `
    <app-model-detail-panel [routerName]="routerName" [model]="model">
      <app-detail-field strong="Description" value="{{ model.description }}" />
      <app-detail-field strong="Category" value="{{ model.category }}" />
    </app-model-detail-panel>
  `,
})
export class AccountDetailComponent {
  model: Account;
  routerName: string;
  constructor() {
    const type = inject(ActivatedRoute).snapshot.data['type'];
    this.routerName = `${type.toLowerCase()}Accounts`;
    this.model = toModelFromHistory();
  }
}
