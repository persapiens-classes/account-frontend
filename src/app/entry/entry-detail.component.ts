import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createEntry, Entry, jsonToEntry } from './entry';
import { DetailFieldComponent } from '../field/detail-field.component';
import { BeanDetailComponent } from '../bean/bean-detail.component';

@Component({
  selector: 'app-entry-detail',
  imports: [CommonModule, DetailFieldComponent],
  template: `
    <app-detail-field
      strong="Date"
      value="{{ bean.date.toLocaleDateString() }} {{ bean.date.toLocaleTimeString() }}"
    />
    <app-detail-field strong="In Owner" value="{{ bean.inOwner }}" />
    <app-detail-field
      strong="In Account"
      value="{{ bean.inAccount.description }} - {{ bean.inAccount.category }}"
    />
    <app-detail-field strong="Out Owner" value="{{ bean.outOwner }}" />
    <app-detail-field
      strong="Out Account"
      value="{{ bean.outAccount.description }} - {{ bean.outAccount.category }}"
    />
    <app-detail-field strong="Value" value="{{ bean.value | number: '1.2-2' }}" />
    <app-detail-field strong="Note" value="{{ bean.note }}" />
  `,
})
export class EntryDetailComponent extends BeanDetailComponent<Entry> {
  constructor() {
    super(createEntry, jsonToEntry);
  }
}
