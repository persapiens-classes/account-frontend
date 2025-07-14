import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Entry } from './entry';
import { HttpClient } from '@angular/common/http';
import { BeanListComponent } from '../bean/bean-list.component';
import { ButtonModule } from 'primeng/button';
import { StartDetailButtonComponent } from '../bean/start-detail-button.component';
import { StartUpdateButtonComponent } from '../bean/start-update-button.component';
import { RemoveButtonComponent } from '../bean/remove-button.component';
import { AppMessageService } from '../app-message-service';
import { EntryListService } from './entry-list-service';
import { EntryRemoveService } from './entry-remove-service';
import { BeanListPanelComponent } from '../bean/bean-list-panel.component';

@Component({
  selector: 'app-entry-list',
  imports: [
    AsyncPipe,
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
      <p-table
        [value]="(beansList$ | async)!"
        [rows]="5"
        [paginator]="true"
        [rowsPerPageOptions]="[5, 7, 10]"
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
            <td>{{ item.inOwner }}</td>
            <td>{{ item.inAccount.description }}</td>
            <td>{{ item.outOwner }}</td>
            <td>{{ item.outAccount.description }}</td>
            <td>{{ item.date.toLocaleDateString() }}</td>
            <td>{{ item.value | number: '1.2-2' }}</td>
            <td><app-start-detail-button [item]="item" [routerName]="routerName" /></td>
            <td><app-start-update-button [item]="item" [routerName]="routerName" /></td>
            <td>
              <app-remove-button
                [item]="item"
                [beanRemoveService]="beanRemoveService"
                [beanName]="beanName"
                (removed)="removed()"
              />
            </td>
          </tr>
        </ng-template>
      </p-table>
    </app-bean-list-panel>
  `,
})
export class EntryListComponent extends BeanListComponent<Entry> {
  beanRemoveService: EntryRemoveService;

  constructor() {
    const http = inject(HttpClient);
    const route = inject(ActivatedRoute);
    const type = route.snapshot.data['type'];
    super(
      inject(AppMessageService),
      new EntryListService(http, type),
      `${type} Entry`,
      `${type.toLowerCase()}Entries`,
    );

    this.beanRemoveService = new EntryRemoveService(http, type);
  }
}
