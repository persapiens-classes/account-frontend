import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { AutoFocusModule } from 'primeng/autofocus';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { CreditAccount } from './creditAccount';
import { BeanListComponent } from '../bean/bean-list.component';
import { CreditAccountService } from './creditAccount-service';

@Component({
  selector: 'creditAccount-list',
  imports: [AsyncPipe, FormsModule, ButtonModule, TableModule, PanelModule, AutoFocusModule, DividerModule, TooltipModule],
  template: `
    <p-button icon="pi pi-plus" (onClick)="startInsert()" autofocus="true" pTooltip="Start new credit account" />

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
            <td><p-button icon="pi pi-pencil" (onClick)="startUpdate(item)" pTooltip="Edit the credit account"/></td>
            <td><p-button icon="pi pi-trash" (onClick)="remove(item)" pTooltip="Delete the credit account"/></td>
          </tr>
        </ng-template>
      </p-table>
    </p-panel>
  `
})
export class CreditAccountListComponent extends BeanListComponent<CreditAccount, string> {
  selectedValue: any

  constructor(router: Router, 
    messageService: MessageService,
    beanService: CreditAccountService
  ) {
    super(router, messageService, beanService)
  }

}
