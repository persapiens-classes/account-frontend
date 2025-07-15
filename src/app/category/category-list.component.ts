import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Category } from './category';
import { HttpClient } from '@angular/common/http';
import { CategoryListService } from './category-list-service';
import { StartDetailButtonComponent } from '../bean/start-detail-button.component';
import { StartUpdateButtonComponent } from '../bean/start-update-button.component';
import { RemoveButtonComponent } from '../bean/remove-button.component';
import { AppMessageService } from '../app-message-service';
import { CategoryRemoveService } from './category-remove-service';
import { BeanListPanelComponent } from '../bean/bean-list-panel.component';
import { loadBeans } from '../bean/bean-list-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category-list',
  imports: [
    AsyncPipe,
    ButtonModule,
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
            <td>{{ item.description }}</td>
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
export class CategoryListComponent {
  beansList$: Observable<Category[]>;
  beanName: string;
  routerName: string;
  beanListService: CategoryListService;
  beanRemoveService: CategoryRemoveService;
  appMessageService = inject(AppMessageService);

  constructor() {
    const http = inject(HttpClient);
    const route = inject(ActivatedRoute);
    const type = route.snapshot.data['type'];
    this.beanName = `${type} Category`;
    this.routerName = `${type.toLowerCase()}Categories`;

    this.beanRemoveService = new CategoryRemoveService(http, type);
    this.beanListService = new CategoryListService(http, type);

    /* jscpd:ignore-start */
    this.beansList$ = loadBeans(this.beanListService, this.appMessageService, this.beanName);
  }

  removed() {
    this.beansList$ = loadBeans(this.beanListService, this.appMessageService, this.beanName);
  }
  /* jscpd:ignore-end */
}
