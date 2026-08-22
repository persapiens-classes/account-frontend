import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Entry, EntrySchema } from './entry';
import { DetailFieldComponent } from '../field/detail-field.component';
import { ModelDetailPanelComponent } from '../models/model-detail-panel.component';
import { ActivatedRoute } from '@angular/router';
import { toModelFromHistory } from '../models/models';

@Component({
  selector: 'app-entry-detail',
  imports: [CommonModule, DetailFieldComponent, ModelDetailPanelComponent],
  template: `
    <app-model-detail-panel [routerName]="routerName" [model]="model">
      <app-detail-field
        strong="Date"
        value="{{ model.date.toLocaleDateString() }} {{ model.date.toLocaleTimeString() }}"
      />
      <app-detail-field strong="In Owner" value="{{ model.inOwner }}" />
      <app-detail-field
        strong="In Account"
        value="{{ model.inAccount.description }} - {{ model.inAccount.category }}"
      />
      <app-detail-field strong="Out Owner" value="{{ model.outOwner }}" />
      <app-detail-field
        strong="Out Account"
        value="{{ model.outAccount.description }} - {{ model.outAccount.category }}"
      />
      <app-detail-field strong="Value" value="{{ model.value | number: '1.2-2' }}" />
      <app-detail-field strong="Note" value="{{ model.note }}" />
    </app-model-detail-panel>
  `,
})
export class EntryDetailComponent {
  model: Entry;
  routerName: string;
  constructor() {
    const type = inject(ActivatedRoute).snapshot.data['type'];
    this.routerName = `${type.toLowerCase()}Entries`;
    this.model = toModelFromHistory(EntrySchema);
  }
}
