import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { AutoFocusModule } from 'primeng/autofocus';
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';
import { Entry, EntryInsertUpdate } from './entry';
import { HttpClient } from '@angular/common/http';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { BeanDetailComponent } from '../bean/bean-detail.component';
import { EntryService } from './entry-service';

@Component({
  selector: `{{ type }}Entry-detail`,
  imports: [InputNumberModule, DatePickerModule, SelectModule, ButtonModule, InputTextModule, PanelModule, AutoFocusModule, CommonModule, TooltipModule],
  template: `
      <p-panel header="Detail">
        <div class="margin-bottom detail-field">
          <strong>Date</strong>
          {{ bean.date.toLocaleDateString() }} {{ bean.date.toLocaleTimeString() }}
        </div>

        <div class="margin-bottom detail-field">
          <strong>In Owner</strong>
          {{ bean.inOwner }}
        </div>

        <div class="margin-bottom detail-field">
          <strong>In Account</strong>
          {{ bean.inAccount.description }} - {{ bean.inAccount.category }}
        </div>

        <div class="margin-bottom detail-field">
          <strong>Out Owner</strong>
          {{ bean.outOwner }}
        </div>

        <div class="margin-bottom detail-field">
          <strong>Out Account</strong>
          {{ bean.outAccount.description }} - {{ bean.outAccount.category }}
        </div>

        <div class="margin-bottom detail-field">
          <strong>Value</strong>
          {{ bean.value | number:'1.2-2' }}
        </div>

        <div class="margin-bottom detail-field">
          <strong>Note</strong>
          {{ bean.note }}
        </div>

        <p-button icon="pi pi-list" (onClick)="list()" [style]="{'margin-right': '10px'}" pTooltip="Return to list"/>
        <p-button icon="pi pi-pencil" (onClick)="startUpdate()" pTooltip="Start Edit"/>
      </p-panel>
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
