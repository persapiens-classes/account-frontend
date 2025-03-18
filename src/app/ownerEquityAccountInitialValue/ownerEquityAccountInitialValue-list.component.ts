import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { AutoFocusModule } from 'primeng/autofocus';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { OwnerEquityAccountInitialValue, OwnerEquityAccountInitialValueInsert } from './ownerEquityAccountInitialValue';
import { BeanListComponent } from '../bean/bean-list.component';
import { OwnerEquityAccountInitialValueService } from './ownerEquityAccountInitialValue-service';

@Component({
  selector: 'ownerEquityAccountInitialValue-list',
  imports: [CommonModule, AsyncPipe, FormsModule, ButtonModule, TableModule, PanelModule, AutoFocusModule, DividerModule, TooltipModule],
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
            <th pSortableColumn="owner">
              Owner <p-sortIcon field="owner" />
            </th>
            <th pSortableColumn="equityAccount">
              Equity Account <p-sortIcon field="equityAccount" />
            </th>
            <th pSortableColumn="value">
              Value <p-sortIcon field="value" />
            </th>
            <th>Detail</th>
            <th>Edit</th>
            <th>Remove</th>
          </tr>
          <tr>
            <th>
              <p-columnFilter
                type="text"
                field="owner"
                placeholder="Search by owner"
                ariaLabel="Filter Owner"
              />
            </th>
          </tr>
        </ng-template>
        <ng-template #body let-item>
          <tr>
            <td>{{ item.owner }}</td>
            <td>{{ item.equityAccount.description }}</td>
            <td>{{ item.value | number:'1.2-2' }}</td>
            <td><p-button icon="pi pi-search" (onClick)="startDetail(item)" pTooltip="Detail the owner"/></td>
            <td><p-button icon="pi pi-pencil" (onClick)="startUpdate(item)" pTooltip="Edit the owner"/></td>
            <td><p-button icon="pi pi-trash" (onClick)="remove(item)" pTooltip="Delete the owner"/></td>
          </tr>
        </ng-template>
      </p-table>
    </p-panel>
  `
})
export class OwnerEquityAccountInitialValueListComponent extends BeanListComponent<OwnerEquityAccountInitialValue, OwnerEquityAccountInitialValueInsert, number> {

  constructor(router: Router,
    messageService: MessageService,
    beanService: OwnerEquityAccountInitialValueService
  ) {
    super(router, messageService, beanService)
  }

}
