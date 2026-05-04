import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { StartDetailButtonComponent } from '../bean/start-detail-button.component';
import { StartUpdateButtonComponent } from '../bean/start-update-button.component';
import { RemoveButtonComponent } from '../bean/remove-button.component';
import { Balance } from './balance';
import { OwnerEquityAccountInitialValueRemoveService } from './owner-equity-account-initial-value-remove-service';
import { BeanListPanelComponent } from '../bean/bean-list-panel.component';

import { BalanceListService } from './balance-list-service';

@Component({
  selector: 'app-balance-list',
  imports: [
    CommonModule,
    TableModule,
    TooltipModule,
    ButtonModule,
    StartDetailButtonComponent,
    StartUpdateButtonComponent,
    RemoveButtonComponent,
    BeanListPanelComponent,
  ],
  template: `
    <app-bean-list-panel [routerName]="routerName">
      <div class="w-full">
        <p-table
          [value]="beansList()"
          [rows]="5"
          [paginator]="true"
          [rowsPerPageOptions]="[5, 7, 10]"
          tableStyleClass="table-stack-mobile"
          stripedRows="true"
        >
          <ng-template #header>
            <tr>
              <th pSortableColumn="owner">Owner <p-sortIcon field="owner" /></th>
              <th pSortableColumn="equityAccount.description">
                Equity Account <p-sortIcon field="equityAccount" />
              </th>
              <th pSortableColumn="balance">Balance <p-sortIcon field="balance" /></th>
              <th pSortableColumn="initialValue">
                Initial Value <p-sortIcon field="initialValue" />
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
              <td data-label="Owner">{{ item.owner }}</td>
              <td data-label="Equity Account">{{ item.equityAccount.description }}</td>
              <td data-label="Balance">{{ item.balance | number: '1.2-2' }}</td>
              <td data-label="Initial Value">{{ item.initialValue | number: '1.2-2' }}</td>
              <td data-label="Detail">
                <app-start-detail-button [item]="item" [routerName]="routerName" />
              </td>
              <td data-label="Edit">
                <app-start-update-button [item]="item" [routerName]="routerName" />
              </td>
              <td data-label="Remove">
                <app-remove-button
                  [beansList]="beansList"
                  [item]="item"
                  [beanRemoveService]="beanRemoveService"
                  [beanName]="beanName"
                />
              </td>
            </tr>
          </ng-template>

          <ng-template #footer>
            <tr>
              <td colspan="2"><strong>Total</strong></td>
              <td>
                <strong
                  class="text-xl font-bold"
                  [class.text-green-400]="total() >= 0"
                  [class.text-red-400]="total() < 0"
                  >{{ total() | number: '1.2-2' }}</strong
                >
              </td>
              <td colspan="4"></td>
            </tr>
          </ng-template>
        </p-table>

        <div class="mt-2 text-right md:hidden">
          <strong
            class="text-xl font-bold"
            [class.text-green-400]="total() >= 0"
            [class.text-red-400]="total() < 0"
            >Total: {{ total() | number: '1.2-2' }}</strong
          >
        </div>
      </div>
    </app-bean-list-panel>
  `,
})
export class BalanceListComponent {
  beanName = 'Balance';
  routerName = 'balances';
  beanRemoveService = inject(OwnerEquityAccountInitialValueRemoveService);

  beansList = inject(BalanceListService).findAll();

  total = computed(() =>
    this.beansList().reduce((sum: number, b: Balance) => sum + (b.balance ?? 0), 0),
  );
}
