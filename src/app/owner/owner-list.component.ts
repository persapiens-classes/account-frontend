import { Component } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Owner } from './owner';
import { BeanListComponent } from '../bean/bean-list.component';
import { ButtonModule } from 'primeng/button';
import { StartDetailButtonComponent } from '../bean/start-detail-button.component';
import { StartUpdateButtonComponent } from '../bean/start-update-button.component';
import { RemoveButtonComponent } from '../bean/remove-button.component';
import { AppMessageService } from '../app-message-service';
import { OwnerListService } from './owner-list-service';
import { OwnerRemoveService } from './owner-remove-service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'owner-list',
  imports: [
    AsyncPipe,
    CommonModule,
    TableModule,
    TooltipModule,
    ButtonModule,
    StartDetailButtonComponent,
    StartUpdateButtonComponent,
    RemoveButtonComponent,
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
          <td><a-start-detail-button [item]="item" [beansName]="beanListService.beansName" /></td>
          <td><a-start-update-button [item]="item" [beansName]="beanListService.beansName" /></td>
          <td>
            <a-remove-button
              [item]="item"
              [beanRemoveService]="beanRemoveService"
              (removed)="removed()"
            />
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
})
export class OwnerListComponent extends BeanListComponent<Owner> {
  beanRemoveService: OwnerRemoveService;

  constructor(
    http: HttpClient,
    accoutMessageService: AppMessageService,
    beanService: OwnerListService,
  ) {
    super(accoutMessageService, beanService);

    this.beanRemoveService = new OwnerRemoveService(http);
  }
}
