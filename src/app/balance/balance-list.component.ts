import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from '@openng/optimus-ui/table';
import { TooltipModule } from '@openng/optimus-ui/tooltip';
import { ButtonModule } from '@openng/optimus-ui/button';
import { StartDetailButtonComponent } from '../models/start-detail-button.component';
import { StartUpdateButtonComponent } from '../models/start-update-button.component';
import { RemoveButtonComponent } from '../models/remove-button.component';
import { Balance, balanceId } from './balance';
import { OwnerEquityAccountInitialValueRemoveService } from './owner-equity-account-initial-value-remove-service';
import { ModelListPanelComponent } from '../models/model-list-panel.component';

import { BalanceListService } from './balance-list-service';
import { PATHS } from '../app.paths';

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
    ModelListPanelComponent,
  ],
  template: `
    <app-model-list-panel [routerName]="routerName">
      <div class="w-full">
        <p-table
          data-cy="balances-table"
          [value]="modelsList()"
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
                  [pt]="{
                    pcFilterInputText: {
                      root: { 'data-cy': 'filter-owner-input' },
                    },
                  }"
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
            <tr data-cy="balances-table-row">
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
                  [modelIdFn]="modelIdFn"
                  [modelsList]="modelsList"
                  [item]="item"
                  [modelRemoveService]="modelRemoveService"
                  [modelName]="modelName"
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
    </app-model-list-panel>
  `,
})
export class BalanceListComponent {
  modelName = 'Balance';
  routerName = PATHS.BALANCE_PATH;
  modelRemoveService = inject(OwnerEquityAccountInitialValueRemoveService);
  modelIdFn = balanceId;

  modelsList = inject(BalanceListService).findAll();

  total = computed(() =>
    this.modelsList().reduce((sum: number, b: Balance) => sum + (b.balance ?? 0), 0),
  );
}
