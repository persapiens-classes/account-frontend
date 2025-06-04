import { Component } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { BalanceListService } from './balance-list-service';
import { BeanListComponent } from '../bean/bean-list.component';
import { ButtonModule } from 'primeng/button';
import { StartDetailButton } from '../bean/start-detail-button';
import { StartUpdateButton } from '../bean/start-update-button';
import { RemoveButton } from '../bean/remove-button';
import { AppMessageService } from '../app-message-service';
import { Balance } from './balance';
import { OwnerEquityAccountInitialValueRemoveService } from './owner-equity-account-initial-value-remove-service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'balance-list',
  imports: [
    AsyncPipe,
    CommonModule,
    TableModule,
    TooltipModule,
    ButtonModule,
    StartDetailButton,
    StartUpdateButton,
    RemoveButton,
  ],
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
          <th pSortableColumn="equityAccount.description">
            Equity Account <p-sortIcon field="equityAccount" />
          </th>
          <th pSortableColumn="balance">Balance <p-sortIcon field="balance" /></th>
          <th pSortableColumn="initialValue">Initial Value <p-sortIcon field="initialValue" /></th>
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
          <td>{{ item.balance | number: '1.2-2' }}</td>
          <td>{{ item.initialValue | number: '1.2-2' }}</td>
          <td><a-start-detail-button [item]="item" [beansName]="beanListService.beansName" /></td>
          <td><a-start-update-button [item]="item" [beansName]="beanListService.beansName" /></td>
          <td>
            <a-remove-button
              [item]="item"
              [beanRemoveService]="beanRemoveService"
              (removed)="removed()"
            />
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
})
export class BalanceListComponent extends BeanListComponent<Balance> {
  beanRemoveService: OwnerEquityAccountInitialValueRemoveService;

  constructor(
    http: HttpClient,
    appMessageService: AppMessageService,
    beanService: BalanceListService,
  ) {
    super(appMessageService, beanService);

    this.beanRemoveService = new OwnerEquityAccountInitialValueRemoveService(http);
  }
}
