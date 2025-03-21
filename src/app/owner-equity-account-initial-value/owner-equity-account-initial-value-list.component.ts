import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { OwnerEquityAccountInitialValue, OwnerEquityAccountInitialValueInsert } from './owner-equity-account-initial-value';
import { OwnerEquityAccountInitialValueService } from './owner-equity-account-initial-value-service';
import { BalanceService } from './balance-service';
import { catchError, Observable, of, tap } from 'rxjs';
import { BeanListComponent } from '../bean/bean-list.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'owner-equity-account-initial-value-list',
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
          <th pSortableColumn="owner">Owner <p-sortIcon field="owner" /></th>
          <th pSortableColumn="equityAccount.description">Equity Account <p-sortIcon field="equityAccount" /></th>
          <th>Balance</th>
          <th pSortableColumn="value">Value <p-sortIcon field="value" /></th>
          <th>Detail</th>
          <th>Edit</th>
          <th>Remove</th>
        </tr>
        <tr>
          <th>
            <p-columnFilter type="text" field="owner"
              placeholder="owner" ariaLabel="Filter Owner" />
          </th>
          <th>
            <p-columnFilter type="text" field="equityAccount.description"
              placeholder="description" ariaLabel="Filter Equity Account" />
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
