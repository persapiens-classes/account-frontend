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
import { Category } from './category';
import { BeanListComponent } from '../bean/bean-list.component';
import { CategoryService } from './category-service';

@Component({
  selector: 'category-list',
  imports: [AsyncPipe, FormsModule, ButtonModule, TableModule, PanelModule, AutoFocusModule, DividerModule, TooltipModule],
  template: `
    <p-button icon="pi pi-plus" (onClick)="startInsert()" autofocus="true" pTooltip="Start new category" />

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
          </tr>
        </ng-template>
        <ng-template #body let-item>
            <tr>
                <td>{{ item.description }}</td>
                <td><p-button icon="pi pi-pencil" (onClick)="startUpdate(item)" pTooltip="Edit the category"/></td>
                <td><p-button icon="pi pi-trash" (onClick)="remove(item)" pTooltip="Delete the category"/></td>
            </tr>
        </ng-template>
      </p-table>
    </p-panel>
  `
})
export class CategoryListComponent extends BeanListComponent<Category, string> {

  constructor(router: Router, 
    messageService: MessageService,
    beanService: CategoryService
  ) {
    super(router, messageService, beanService)
  }

}
