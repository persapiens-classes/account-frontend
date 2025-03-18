import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { AutoFocusModule } from 'primeng/autofocus';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { Owner } from './owner';
import { BeanListComponent } from '../bean/bean-list.component';
import { OwnerService } from './owner-service';

@Component({
  selector: 'owner-list',
  imports: [AsyncPipe, FormsModule, ButtonModule, TableModule, PanelModule, AutoFocusModule, DividerModule, TooltipModule],
  template: `
    <p-button icon="pi pi-plus" (onClick)="startInsert()" autofocus="true" pTooltip="Start new owner" />

    <p-divider />

    <p-panel header="List">
      <p-table 
        [value]="(beansList$ | async)!"
        [rows]="5"
        [paginator]="true"
        [rowsPerPageOptions]="[5, 7, 10]"
      >
        <ng-template #header>
          <tr>
            <th pSortableColumn="name">
              Name <p-sortIcon field="name" />
            </th>
            <th>Detail</th>
            <th>Edit</th>
            <th>Remove</th>
          </tr>
          <tr>
            <th>
              <p-columnFilter
                type="text"
                field="name"
                placeholder="Search by name"
                ariaLabel="Filter Name"
              />
            </th>
          </tr>
        </ng-template>
        <ng-template #body let-item>
          <tr>
            <td>{{ item.name }}</td>
            <td><p-button icon="pi pi-search" (onClick)="startDetail(item)" pTooltip="Detail the owner"/></td>
            <td><p-button icon="pi pi-pencil" (onClick)="startUpdate(item)" pTooltip="Edit the owner"/></td>
            <td><p-button icon="pi pi-trash" (onClick)="remove(item)" pTooltip="Delete the owner"/></td>
          </tr>
        </ng-template>
      </p-table>
    </p-panel>
  `
})
export class OwnerListComponent extends BeanListComponent<Owner, Owner, Owner> {

  constructor(router: Router,
    messageService: MessageService,
    beanService: OwnerService
  ) {
    super(router, messageService, beanService)
  }

}
