import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Category } from './category';
import { HttpClient } from '@angular/common/http';
import { CategoryService } from './category-service';
import { BeanListComponent } from '../bean/bean-list.component';
import { StartDetailButton } from "../bean/start-detail-button";
import { StartUpdateButton } from "../bean/start-update-button";
import { RemoveButton } from "../bean/remove-button";

@Component({
  selector: 'category-list',
  imports: [AsyncPipe, ButtonModule, TableModule, TooltipModule, ButtonModule, StartDetailButton, StartUpdateButton, RemoveButton],
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
          <th>Detail</th>
          <th>Edit</th>
          <th>Remove</th>
        </tr>
        <tr>
          <th>
            <p-columnFilter type="text" field="description"
              placeholder="description" ariaLabel="Filter Description" />
          </th>
        </tr>
      </ng-template>
      <ng-template #body let-item>
        <tr>
          <td>{{ item.description }}</td>
          <td> <a-start-detail-button [item]=item [beanService]="beanService" /> </td>
          <td> <a-start-update-button [item]=item [beanService]="beanService" /> </td>
          <td> <a-remove-button [item]=item [beanService]="beanService" (removed)="removed()" /> </td>
        </tr>
      </ng-template>
    </p-table>
  `
})
export class CategoryListComponent extends BeanListComponent<Category, Category, Category> {
  constructor(
    http: HttpClient,
    route: ActivatedRoute
  ) {
    super(new CategoryService(http, route.snapshot.data['type']))
  }

}
