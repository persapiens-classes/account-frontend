import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { Entry, EntryInsertUpdate } from './entry';
import { HttpClient } from '@angular/common/http';
import { EntryService } from './entry-service';
import { BeanListComponent } from '../bean/bean-list.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'entry-list',
  imports: [AsyncPipe, CommonModule, TableModule, TooltipModule, ButtonModule],
  template: `
    <p-table 
      [value]="(beansList$ | async)!"
      [rows]="5"
      [paginator]="true"
      [rowsPerPageOptions]="[5, 7, 10]"
      stripedRows="true"
    >
      <ng-template #header>
        <tr>
          <th pSortableColumn="inOwner"> InOwner <p-sortIcon field="inOwner" /> </th>
          <th pSortableColumn="inAccount.description"> InAccount <p-sortIcon field="inAccount.description" /> </th>
          <th pSortableColumn="outOwner"> OutOwner <p-sortIcon field="outOwner" /> </th>
          <th pSortableColumn="outAccount.description"> OutAccount <p-sortIcon field="outAccount.description" /> </th>
          <th pSortableColumn="date"> Date <p-sortIcon field="date" /> </th>
          <th pSortableColumn="value"> Value <p-sortIcon field="value" /> </th>
          <th>Detail</th>
          <th>Edit</th>
          <th>Remove</th>
        </tr>
        <tr>
          <th>
            <p-columnFilter type="text" field="inOwner"
              placeholder="name" ariaLabel="Filter InOwner Name" />
          </th>
          <th>
            <p-columnFilter type="text" field="inAccount.description"
              placeholder="description" ariaLabel="Filter InAccount Description" />
          </th>
          <th>
            <p-columnFilter type="text" field="outOwner"
              placeholder="name" ariaLabel="Filter OutOwner Name" />
          </th>
          <th>
            <p-columnFilter type="text" field="outAccount.description"
              placeholder="description" ariaLabel="Filter OutAccount Description" />
          </th>
          <th>
            <p-columnFilter type="date" field="date"
              placeholder="date" ariaLabel="Filter Date" />
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
          <td>{{ item.value | number:'1.2-2' }}</td>
          <td><p-button icon="pi pi-search" (onClick)="startDetail(item)" pTooltip="Detail the entry"/></td>
          <td><p-button icon="pi pi-pencil" (onClick)="startUpdate(item)" pTooltip="Edit the entry"/></td>
          <td><p-button icon="pi pi-trash" (onClick)="remove(item)" pTooltip="Delete the entry"/></td>
        </tr>
      </ng-template>
    </p-table>
  `
})
export class EntryListComponent extends BeanListComponent<Entry, EntryInsertUpdate, EntryInsertUpdate> {

  constructor(router: Router,
    messageService: MessageService,
    http: HttpClient,
    route: ActivatedRoute
  ) {
    super(router, messageService, new EntryService(http, route.snapshot.data['type']))
  }

}
