import { Component, inject, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from '@openng/optimus-ui/button';
import { TableModule } from '@openng/optimus-ui/table';
import { TooltipModule } from '@openng/optimus-ui/tooltip';
import { Account, accountId } from './account';
import { HttpClient } from '@angular/common/http';
import { StartDetailButtonComponent } from '../models/start-detail-button.component';
import { RemoveButtonComponent } from '../models/remove-button.component';
import { StartUpdateButtonComponent } from '../models/start-update-button.component';
import { AppMessageService } from '../app-message-service';
import { AccountListService } from './account-list-service';
import { AccountRemoveService } from './account-remove-service';
import { ModelListPanelComponent } from '../models/model-list-panel.component';

@Component({
  selector: 'app-account-list',
  imports: [
    ButtonModule,
    TableModule,
    TooltipModule,
    ButtonModule,
    RemoveButtonComponent,
    StartDetailButtonComponent,
    StartUpdateButtonComponent,
    ModelListPanelComponent,
  ],
  template: `
    <app-model-list-panel [routerName]="routerName">
      <p-table
        [value]="modelsList()"
        [rows]="5"
        [paginator]="true"
        [rowsPerPageOptions]="[5, 7, 10]"
        tableStyleClass="table-stack-mobile"
        stripedRows="true"
      >
        <ng-template #header>
          <tr>
            <th pSortableColumn="description">Description <p-sortIcon field="description" /></th>
            <th pSortableColumn="category">Category <p-sortIcon field="category" /></th>
            <th>Detail</th>
            <th>Edit</th>
            <th>Remove</th>
          </tr>
          <tr>
            <th>
              <p-columnFilter
                type="text"
                field="description"
                placeholder="description"
                ariaLabel="Filter Description"
              />
            </th>
            <th>
              <p-columnFilter
                type="text"
                field="category"
                placeholder="description"
                ariaLabel="Filter Category"
              />
            </th>
          </tr>
        </ng-template>
        <ng-template #body let-item>
          <tr>
            <td data-label="Description">{{ item.description }}</td>
            <td data-label="Category">{{ item.category }}</td>
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
      </p-table>
    </app-model-list-panel>
  `,
})
export class AccountListComponent {
  modelName: string;
  routerName: string;
  modelRemoveService: AccountRemoveService;

  modelsList: WritableSignal<Account[]>;
  modelIdFn = accountId;

  constructor() {
    const http = inject(HttpClient);
    const activatedRoute = inject(ActivatedRoute);
    const type = activatedRoute.snapshot.data['type'];
    this.modelName = `${type} Account`;
    this.routerName = `${type.toLowerCase()}Accounts`;
    this.modelRemoveService = new AccountRemoveService(http, type);

    this.modelsList = new AccountListService(inject(AppMessageService), type).findAll();
  }
}
