import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from '@openng/optimus-ui/table';
import { ButtonModule } from '@openng/optimus-ui/button';
import { TooltipModule } from '@openng/optimus-ui/tooltip';
import { StartDetailButtonComponent } from '../models/start-detail-button.component';
import { StartUpdateButtonComponent } from '../models/start-update-button.component';
import { RemoveButtonComponent } from '../models/remove-button.component';
import { OwnerRemoveService } from './owner-remove-service';
import { ModelListPanelComponent } from '../models/model-list-panel.component';
import { OwnerListService } from './owner-list-service';
import { ownerId } from './owner';

@Component({
  selector: 'app-owner-list',
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
      <p-table
        data-cy="owners-table"
        [value]="modelsList()"
        [rows]="5"
        [paginator]="true"
        [rowsPerPageOptions]="[5, 7, 10]"
        tableStyleClass="table-stack-mobile"
        stripedRows="true"
      >
        <ng-template #header>
          <tr>
            <th pSortableColumn="name">Name <p-sortIcon field="name" /></th>
            <th>Detail</th>
            <th>Edit</th>
            <th>Remove</th>
          </tr>
          <tr>
            <th>
              <p-columnFilter
                data-cy="filter-name"
                type="text"
                field="name"
                placeholder="name"
                ariaLabel="Filter Name"
              />
            </th>
          </tr>
        </ng-template>
        <ng-template #body let-item>
          <tr>
            <td data-label="Name">{{ item.name }}</td>
            <td data-label="Detail">
              <app-start-detail-button [item]="item" [routerName]="routerName" />
            </td>
            <td data-label="Edit">
              <app-start-update-button [item]="item" [routerName]="routerName" />
            </td>
            <td data-label="Remove">
              <app-remove-button
                [modelsList]="modelsList"
                [item]="item"
                [modelRemoveService]="modelRemoveService"
                [modelName]="modelName"
                [modelIdFn]="modelIdFn"
              />
            </td>
          </tr>
        </ng-template>
      </p-table>
    </app-model-list-panel>
  `,
})
export class OwnerListComponent {
  modelName = 'Owner';
  routerName = 'owners';
  modelRemoveService = inject(OwnerRemoveService);

  modelsList = inject(OwnerListService).findAll();
  modelIdFn = ownerId;
}
