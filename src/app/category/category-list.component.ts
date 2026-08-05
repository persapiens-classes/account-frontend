import { Component, inject, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from '@openng/optimus-ui/button';
import { TableModule } from '@openng/optimus-ui/table';
import { TooltipModule } from '@openng/optimus-ui/tooltip';
import { Category, categoryId } from './category';
import { HttpClient } from '@angular/common/http';
import { CategoryListService } from './category-list-service';
import { StartDetailButtonComponent } from '../models/start-detail-button.component';
import { StartUpdateButtonComponent } from '../models/start-update-button.component';
import { RemoveButtonComponent } from '../models/remove-button.component';
import { AppMessageService } from '../app-message-service';
import { CategoryRemoveService } from './category-remove-service';
import { ModelListPanelComponent } from '../models/model-list-panel.component';

@Component({
  selector: 'app-category-list',
  imports: [
    ButtonModule,
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
            <th pSortableColumn="description">Description <p-sortIcon field="description" /></th>
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
          </tr>
        </ng-template>
        <ng-template #body let-item>
          <tr>
            <td data-label="Description">{{ item.description }}</td>
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
export class CategoryListComponent {
  modelName: string;
  routerName: string;
  modelRemoveService: CategoryRemoveService;

  modelsList: WritableSignal<Category[]>;
  modelIdFn = categoryId;

  constructor() {
    const http = inject(HttpClient);
    const activatedRoute = inject(ActivatedRoute);
    const type = activatedRoute.snapshot.data['type'];
    this.modelName = `${type} Category`;
    this.routerName = `${type.toLowerCase()}Categories`;
    this.modelRemoveService = new CategoryRemoveService(http, type);

    this.modelsList = new CategoryListService(inject(AppMessageService), type).findAll();
  }
}
