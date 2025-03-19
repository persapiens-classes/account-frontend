import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { AutoFocusModule } from 'primeng/autofocus';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { OwnerEquityAccountInitialValue, OwnerEquityAccountInitialValueInsert } from './ownerEquityAccountInitialValue';
import { BeanListComponent } from '../bean/bean-list.component';
import { OwnerEquityAccountInitialValueService } from './ownerEquityAccountInitialValue-service';
import { BalanceService } from './balance-service';
import { catchError, Observable, of, tap } from 'rxjs';

@Component({
  selector: 'ownerEquityAccountInitialValue-list',
  imports: [CommonModule, AsyncPipe, FormsModule, ButtonModule, TableModule, PanelModule, AutoFocusModule, TooltipModule],
  template: `
    <p-panel header="List">
      <ng-template pTemplate="header">
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-left: 10px;">
          <p-button icon="pi pi-plus" (onClick)="startInsert()" autofocus="true" pTooltip="Start new owner" />
        </div>
      </ng-template>

      <p-table 
        [value]="(beansList$ | async)!"
        [rows]="5"
        [paginator]="true"
        [rowsPerPageOptions]="[5, 7, 10]"
        stripedRows="true"
      >
        <ng-template #header>
          <tr>
            <th pSortableColumn="owner">
              Owner <p-sortIcon field="owner" />
            </th>
            <th pSortableColumn="equityAccount.description">
              Equity Account <p-sortIcon field="equityAccount" />
            </th>
            <th>
              Balance
            </th>
            <th pSortableColumn="value">
              Initial Value <p-sortIcon field="value" />
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
                placeholder="owner"
                ariaLabel="Filter Owner"
              />
            </th>
            <th>
              <p-columnFilter
                type="text"
                field="equityAccount.description"
                placeholder="description"
                ariaLabel="Filter Equity Account"
              />
            </th>
          </tr>
        </ng-template>
        <ng-template #body let-item let-i="rowIndex">
          <tr>
            <td>{{ item.owner }}</td>
            <td>{{ item.equityAccount.description }}</td>
            <td>{{ balanceList$[i] | async | number:'1.2-2' }}</td>
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
  balanceList$: Array<Observable<number>>

  constructor(router: Router,
    messageService: MessageService,
    beanService: OwnerEquityAccountInitialValueService,
    balanceService: BalanceService
  ) {
    super(router, messageService, beanService)

    this.balanceList$ = new Array()

    this.beansList$ = this.beansList$.pipe(
      tap((beansList) => {
        this.balanceList$ = new Array(beansList.length)
        beansList.forEach((value, index) => {
          this.balanceList$[index] = balanceService.find(value.owner, value.equityAccount.description)
        })
      }),
      catchError((error) => {
        messageService.add({
          severity: 'error',
          summary: `Error reading balance`,
          detail: `Error : ${error.error.error}`
        })
        return of()
      })
    )

  }

}
