import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';
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
import { loadBeans } from '../bean/bean-list-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-account-list',
  imports: [
    AsyncPipe,
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
export class AccountListComponent {
  beansList$: Observable<Account[]>;
  beanName: string;
  routerName: string;
  beanListService: AccountListService;
  beanRemoveService: AccountRemoveService;
  appMessageService = inject(AppMessageService);

  constructor() {
    const http = inject(HttpClient);
    const activatedRoute = inject(ActivatedRoute);
    const type = activatedRoute.snapshot.data['type'];
    this.beanName = `${type} Account`;
    this.routerName = `${type.toLowerCase()}Accounts`;

    this.beanListService = new AccountListService(http, type);
    this.beanRemoveService = new AccountRemoveService(http, type);

    this.beansList$ = loadBeans(this.beanListService, this.appMessageService, this.beanName);
  }

  removed() {
    this.beansList$ = loadBeans(this.beanListService, this.appMessageService, this.beanName);
  }
}
