import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Entry, EntryInsertUpdate } from './entry';
import { HttpClient } from '@angular/common/http';
import { EntryService } from './entry-service';
import { DetailField } from "../field/detail-field.component";
import { BeanDetailComponent } from '../bean/bean-detail.component';

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

  constructor(
    router: Router,
    http: HttpClient,
    route: ActivatedRoute
  ) {
    super(router, new EntryService(http, route.snapshot.data['type']))
  }

}
