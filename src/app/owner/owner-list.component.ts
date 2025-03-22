import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { Owner } from './owner';
import { OwnerService } from './owner-service';
import { BeanListComponent } from '../bean/bean-list.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'owner-list',
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
          <th pSortableColumn="name"> Name <p-sortIcon field="name" /> </th>
          <th>Detail</th>
          <th>Edit</th>
          <th>Remove</th>
        </tr>
        <tr>
          <th>
            <p-columnFilter type="text" field="name"
              placeholder="name" ariaLabel="Filter Name" />
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
