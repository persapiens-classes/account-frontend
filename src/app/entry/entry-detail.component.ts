import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Entry, EntryInsertUpdate } from './entry';
import { DetailField } from "../field/detail-field.component";
import { BeanDetailComponent } from '../bean/bean-detail.component';
import { EntryCreateService } from './entry-create-service';

@Component({
  selector: 'entry-detail',
  imports: [CommonModule, DetailField],
  template: `
    <a-detail-field strong="Date" value="{{ bean.date.toLocaleDateString() }} {{ bean.date.toLocaleTimeString() }}"/>
    <a-detail-field strong="In Owner" value="{{ bean.inOwner }}"/>
    <a-detail-field strong="In Account" value="{{ bean.inAccount.description }} - {{ bean.inAccount.category }}"/>
    <a-detail-field strong="Out Owner" value="{{ bean.outOwner }}"/>
    <a-detail-field strong="Out Account" value="{{ bean.outAccount.description }} - {{ bean.outAccount.category }}"/>
    <a-detail-field strong="Value" value="{{ bean.value | number:'1.2-2' }}"/>
    <a-detail-field strong="Note" value="{{ bean.note }}"/>
  `
})
export class EntryDetailComponent extends BeanDetailComponent<Entry, EntryInsertUpdate, EntryInsertUpdate> {

  constructor() {
    super(new EntryCreateService())
  }

}
