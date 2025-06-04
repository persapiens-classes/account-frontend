import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Account } from './account';
import { HttpClient } from '@angular/common/http';
import { BeanListComponent } from '../bean/bean-list.component';
import { StartDetailButtonComponent } from '../bean/start-detail-button.component';
import { RemoveButtonComponent } from '../bean/remove-button.component';
import { StartUpdateButtonComponent } from '../bean/start-update-button.component';
import { AppMessageService } from '../app-message-service';
import { AccountListService } from './account-list-service';
import { AccountRemoveService } from './account-remove-service';

@Component({
  selector: 'account-list',
  imports: [
    AsyncPipe,
    ButtonModule,
    TableModule,
    TooltipModule,
    ButtonModule,
    RemoveButtonComponent,
    StartDetailButtonComponent,
    StartUpdateButtonComponent,
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
          <td><a-start-detail-button [item]="item" [beansName]="beanListService.beansName" /></td>
          <td><a-start-update-button [item]="item" [beansName]="beanListService.beansName" /></td>
          <td>
            <a-remove-button
              [item]="item"
              [beanRemoveService]="beanRemoveService"
              [beanList$]="beansList$"
            />
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
})
export class AccountListComponent extends BeanListComponent<Account> {
  beanRemoveService: AccountRemoveService;

  constructor(http: HttpClient, route: ActivatedRoute, appMessageService: AppMessageService) {
    super(appMessageService, new AccountListService(http, route.snapshot.data['type']));

    this.beanRemoveService = new AccountRemoveService(http, route.snapshot.data['type']);
  }
}
