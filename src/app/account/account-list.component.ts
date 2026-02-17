import { Component, inject, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Account } from './account';
import { HttpClient } from '@angular/common/http';
import { StartDetailButtonComponent } from '../bean/start-detail-button.component';
import { RemoveButtonComponent } from '../bean/remove-button.component';
import { StartUpdateButtonComponent } from '../bean/start-update-button.component';
import { AppMessageService } from '../app-message-service';
import { AccountListService } from './account-list-service';
import { AccountRemoveService } from './account-remove-service';
import { BeanListPanelComponent } from '../bean/bean-list-panel.component';

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
    BeanListPanelComponent,
  ],
  template: `
    <app-bean-list-panel [routerName]="routerName">
      <div data-cy="accounts-table">
        <p-table
          [value]="beansList()"
          [rows]="5"
          [paginator]="true"
          [rowsPerPageOptions]="[5, 7, 10]"
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
              <td>{{ item.description }}</td>
              <td>{{ item.category }}</td>
              <td><app-start-detail-button [item]="item" [routerName]="routerName" /></td>
              <td><app-start-update-button [item]="item" [routerName]="routerName" /></td>
              <td>
                <app-remove-button
                  [beansList]="beansList"
                  [item]="item"
                  [beanRemoveService]="beanRemoveService"
                  [beanName]="beanName"
                />
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </app-bean-list-panel>
  `,
})
export class AccountListComponent {
  beanName: string;
  routerName: string;
  beanRemoveService: AccountRemoveService;

  beansList: WritableSignal<Account[]>;

  constructor() {
    const http = inject(HttpClient);
    const activatedRoute = inject(ActivatedRoute);
    const type = activatedRoute.snapshot.data['type'];
    this.beanName = `${type} Account`;
    this.routerName = `${type.toLowerCase()}Accounts`;
    this.beanRemoveService = new AccountRemoveService(http, type);

    this.beansList = new AccountListService(inject(AppMessageService), type).findAll();
  }
}
