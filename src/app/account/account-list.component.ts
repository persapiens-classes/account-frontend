import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { AutoFocusModule } from 'primeng/autofocus';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { Account } from './account';
import { BeanListComponent } from '../bean/bean-list.component';
import { HttpClient } from '@angular/common/http';
import { AccountService } from './account-service';

@Component({
  selector: 'account-list',
  imports: [AsyncPipe, FormsModule, ButtonModule, TableModule, PanelModule, AutoFocusModule, DividerModule, TooltipModule],
  template: `
    <p-button icon="pi pi-plus" (onClick)="startInsert()" autofocus="true" pTooltip="Start new account" />

    <p-divider />

    <p-panel header="List">
      <p-table 
        [value]="(beansList$ | async)!"
        [rows]="3"
        [paginator]="true"
        [rowsPerPageOptions]="[3, 5, 10]"
      >
        <ng-template #header>
          <tr>
              <th pSortableColumn="description">
                Description <p-sortIcon field="description" />
              </th>
              <th pSortableColumn="category">
                Category <p-sortIcon field="category" />
              </th>
              <th>Detail</th>
              <th>Edit</th>
              <th>Remove</th>
          </tr>
          <tr>
              <th>
                <p-columnFilter
                    type="text"
                    field="description"
                    placeholder="Search by description"
                    ariaLabel="Filter Description"
                />
              </th>
              <th>
              <p-columnFilter
                    type="text"
                    field="category"
                    placeholder="Search by category"
                    ariaLabel="Filter Category"
                />
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
    </p-panel>
  `
})
export class AccountListComponent extends BeanListComponent<Account, Account, string> {
  selectedValue: any

  constructor(router: Router,
    messageService: MessageService,
    http: HttpClient,
    route: ActivatedRoute
  ) {
    super(router, messageService, new AccountService(http, route.snapshot.data['type']))
  }

}
