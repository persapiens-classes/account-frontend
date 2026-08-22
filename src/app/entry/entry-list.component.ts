import { Component, inject, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TableModule } from '@openng/optimus-ui/table';
import { TooltipModule } from '@openng/optimus-ui/tooltip';
import { Entry, entryId } from './entry';
import { HttpClient } from '@angular/common/http';
import { ButtonModule } from '@openng/optimus-ui/button';
import { StartDetailButtonComponent } from '../models/start-detail-button.component';
import { StartUpdateButtonComponent } from '../models/start-update-button.component';
import { RemoveButtonComponent } from '../models/remove-button.component';
import { AppMessageService } from '../app-message-service';
import { EntryListService } from './entry-list-service';
import { EntryRemoveService } from './entry-remove-service';
import { ModelListPanelComponent } from '../models/model-list-panel.component';
import { PATHS } from '../app.paths';

@Component({
  selector: 'app-entry-list',
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
        [value]="modelsList()"
        [rows]="5"
        [paginator]="true"
        [rowsPerPageOptions]="[5, 7, 10]"
        tableStyleClass="table-stack-mobile"
        stripedRows="true"
      >
        <ng-template #header>
          <tr>
            <th pSortableColumn="inOwner">InOwner <p-sortIcon field="inOwner" /></th>
            <th pSortableColumn="inAccount.description">
              InAccount <p-sortIcon field="inAccount.description" />
            </th>
            <th pSortableColumn="outOwner">OutOwner <p-sortIcon field="outOwner" /></th>
            <th pSortableColumn="outAccount.description">
              OutAccount <p-sortIcon field="outAccount.description" />
            </th>
            <th pSortableColumn="date">Date <p-sortIcon field="date" /></th>
            <th pSortableColumn="value">Value <p-sortIcon field="value" /></th>
            <th>Detail</th>
            <th>Edit</th>
            <th>Remove</th>
          </tr>
          <tr>
            <th>
              <p-columnFilter
                type="text"
                field="inOwner"
                placeholder="name"
                ariaLabel="Filter InOwner Name"
              />
            </th>
            <th>
              <p-columnFilter
                type="text"
                field="inAccount.description"
                placeholder="description"
                ariaLabel="Filter InAccount Description"
              />
            </th>
            <th>
              <p-columnFilter
                type="text"
                field="outOwner"
                placeholder="name"
                ariaLabel="Filter OutOwner Name"
              />
            </th>
            <th>
              <p-columnFilter
                type="text"
                field="outAccount.description"
                placeholder="description"
                ariaLabel="Filter OutAccount Description"
              />
            </th>
            <th>
              <p-columnFilter type="date" field="date" placeholder="date" ariaLabel="Filter Date" />
            </th>
          </tr>
        </ng-template>
        <ng-template #body let-item>
          <tr>
            <td data-label="InOwner">{{ item.inOwner }}</td>
            <td data-label="InAccount">{{ item.inAccount.description }}</td>
            <td data-label="OutOwner">{{ item.outOwner }}</td>
            <td data-label="OutAccount">{{ item.outAccount.description }}</td>
            <td data-label="Date">{{ item.date.toLocaleDateString() }}</td>
            <td data-label="Value">{{ item.value | number: '1.2-2' }}</td>
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
export class EntryListComponent {
  modelName: string;
  routerName: string;
  modelRemoveService: EntryRemoveService;

  modelsList: WritableSignal<Entry[]>;
  modelIdFn = entryId;

  constructor() {
    const type = inject(ActivatedRoute).snapshot.data['type'];
    this.modelName = `${type} Entry`;
    this.routerName = `${type.toLowerCase()}${PATHS.ENTRY_PATH}`;

    this.modelRemoveService = new EntryRemoveService(inject(HttpClient), type);

    this.modelsList = new EntryListService(inject(AppMessageService), type).findAll();
  }
}
