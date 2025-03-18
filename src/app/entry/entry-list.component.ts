import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { AutoFocusModule } from 'primeng/autofocus';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { Entry, EntryInsertUpdate } from './entry';
import { BeanListComponent } from '../bean/bean-list.component';
import { HttpClient } from '@angular/common/http';
import { EntryService } from './entry-service';

@Component({
  selector: 'creditAccount-list',
  imports: [AsyncPipe, FormsModule, ButtonModule, TableModule, PanelModule, AutoFocusModule, DividerModule, TooltipModule],
  template: `
    <p-button icon="pi pi-plus" (onClick)="startInsert()" autofocus="true" pTooltip="Start new credit account" />

    <p-divider />

    <p-panel header="List">
      <p-table 
        [value]="(beansList$ | async)!"
        [rows]="3"
        [paginator]="true"
        [rowsPerPageOptions]="[3, 5, 10]"
      >
        <ng-template #header>
          <tr>
            <th pSortableColumn="inOwner.name">
              InOwner <p-sortIcon field="inOwner.name" />
            </th>
            <th pSortableColumn="inAccount.description">
              InAccount <p-sortIcon field="inAccount.description" />
            </th>
            <th pSortableColumn="outOwner.name">
              OutOwner <p-sortIcon field="outOwner.name" />
            </th>
            <th pSortableColumn="outAccount.description">
              OutAccount <p-sortIcon field="outAccount.description" />
            </th>
            <th pSortableColumn="date">
              Date <p-sortIcon field="date" />
            </th>
            <th>Detail</th>
            <th>Edit</th>
            <th>Remove</th>
          </tr>
          <tr>
            <th>
              <p-columnFilter
                type="text"
                field="inOwner"
                placeholder="Search by inOwner"
                ariaLabel="Filter InOwner Name"
              />
            </th>
            <th>
              <p-columnFilter
                type="text"
                field="inAccount.description"
                placeholder="Search by inAccount"
                ariaLabel="Filter InAccount Description"
              />
            </th>
            <th>
              <p-columnFilter
                type="text"
                field="outOwner"
                placeholder="Search by outOwner"
                ariaLabel="Filter OutOwner Name"
              />
            </th>
            <th>
              <p-columnFilter
                type="text"
                field="outAccount.description"
                placeholder="Search by outAccount"
                ariaLabel="Filter OutAccount Description"
                />
            </th>
            <th>
              <p-columnFilter
                type="date"
                field="date"
                placeholder="Search by date"
                ariaLabel="Filter Date"
                />
            </th>
          </tr>
        </ng-template>
        <ng-template #body let-item>
          <tr>
            <td>{{ item.inOwner }}</td>
            <td>{{ item.inAccount.description }}</td>
            <td>{{ item.outOwner }}</td>
            <td>{{ item.outAccount.description }}</td>
            <td>{{ item.date.toLocaleDateString() }}</td>
            <td><p-button icon="pi pi-search" (onClick)="startDetail(item)" pTooltip="Detail the entry"/></td>
            <td><p-button icon="pi pi-pencil" (onClick)="startUpdate(item)" pTooltip="Edit the entry"/></td>
            <td><p-button icon="pi pi-trash" (onClick)="remove(item)" pTooltip="Delete the entry"/></td>
          </tr>
        </ng-template>
      </p-table>
    </p-panel>
  `
})
export class EntryListComponent extends BeanListComponent<Entry, EntryInsertUpdate, number> {
  selectedValue: any

  constructor(router: Router,
    messageService: MessageService,
    http: HttpClient,
    route: ActivatedRoute
  ) {
    super(router, messageService, new EntryService(http, route.snapshot.data['type']))
  }

}
