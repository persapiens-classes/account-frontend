import { Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Owner } from './owner';
import { ButtonModule } from 'primeng/button';
import { StartDetailButtonComponent } from '../bean/start-detail-button.component';
import { StartUpdateButtonComponent } from '../bean/start-update-button.component';
import { RemoveButtonComponent } from '../bean/remove-button.component';
import { AppMessageService } from '../app-message-service';
import { OwnerListService } from './owner-list-service';
import { OwnerRemoveService } from './owner-remove-service';
import { BeanListPanelComponent } from '../bean/bean-list-panel.component';
import { Observable } from 'rxjs';
import { loadBeans } from '../bean/bean-list-service';

@Component({
  selector: 'app-owner-list',
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
            <th pSortableColumn="name">Name <p-sortIcon field="name" /></th>
            <th>Detail</th>
            <th>Edit</th>
            <th>Remove</th>
          </tr>
          <tr>
            <th>
              <p-columnFilter type="text" field="name" placeholder="name" ariaLabel="Filter Name" />
            </th>
          </tr>
        </ng-template>
        <ng-template #body let-item>
          <tr>
            <td>{{ item.name }}</td>
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
export class OwnerListComponent {
  beansList$: Observable<Owner[]>;
  beanName = 'Owner';
  routerName = 'owners';
  beanListService = inject(OwnerListService);
  beanRemoveService = inject(OwnerRemoveService);
  appMessageService = inject(AppMessageService);

  constructor() {
    this.beansList$ = loadBeans(this.beanListService, this.appMessageService, this.beanName);
  }

  removed() {
    this.beansList$ = loadBeans(this.beanListService, this.appMessageService, this.beanName);
  }
}
