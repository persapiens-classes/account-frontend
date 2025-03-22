import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { Account } from './account';
import { HttpClient } from '@angular/common/http';
import { AccountService } from './account-service';
import { BeanListComponent } from '../bean/bean-list.component';

@Component({
  selector: 'account-list',
  imports: [AsyncPipe, ButtonModule, TableModule, TooltipModule, ButtonModule],
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
          <th pSortableColumn="description"> Description <p-sortIcon field="description" /> </th>
          <th pSortableColumn="category"> Category <p-sortIcon field="category" /> </th>
          <th>Detail</th>
          <th>Edit</th>
          <th>Remove</th>
        </tr>
        <tr>
          <th>
            <p-columnFilter type="text" field="description"
              placeholder="description" ariaLabel="Filter Description" />
          </th>
          <th>
            <p-columnFilter type="text" field="category"
              placeholder="description" ariaLabel="Filter Category" />
          </th>
        </tr>
      </ng-template>
      <ng-template #body let-item>
        <tr>
          <td>{{ item.description }}</td>
          <td>{{ item.category }}</td>
          <td><p-button icon="pi pi-search" (onClick)="startDetail(item)" pTooltip="Detail the account"/></td>
          <td><p-button icon="pi pi-pencil" (onClick)="startUpdate(item)" pTooltip="Edit the account"/></td>
          <td><p-button icon="pi pi-trash" (onClick)="remove(item)" pTooltip="Delete the account"/></td>
        </tr>
      </ng-template>
    </p-table>
  `
})
export class AccountListComponent extends BeanListComponent<Account, Account, Account> {

  constructor(
    router: Router,
    messageService: MessageService,
    http: HttpClient,
    route: ActivatedRoute
  ) {
    super(router, messageService, new AccountService(http, route.snapshot.data['type']))
  }

}
