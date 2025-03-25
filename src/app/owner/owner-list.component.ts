import { Component } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Owner } from './owner';
import { OwnerService } from './owner-service';
import { BeanListComponent } from '../bean/bean-list.component';
import { ButtonModule } from 'primeng/button';
import { StartDetailButton } from "../bean/start-detail-button";
import { StartUpdateButton } from "../bean/start-update-button";
import { RemoveButton } from "../bean/remove-button";
import { MessageService } from 'primeng/api';

@Component({
  selector: 'owner-list',
  imports: [AsyncPipe, CommonModule, TableModule, TooltipModule, ButtonModule, StartDetailButton, StartUpdateButton, RemoveButton],
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
          <th pSortableColumn="name"> Name <p-sortIcon field="name" /> </th>
          <th>Detail</th>
          <th>Edit</th>
          <th>Remove</th>
        </tr>
        <tr>
          <th>
            <p-columnFilter type="text" field="name"
              placeholder="name" ariaLabel="Filter Name" />
          </th>
        </tr>
      </ng-template>
      <ng-template #body let-item>
        <tr>
          <td>{{ item.name }}</td>
          <td> <a-start-detail-button [item]=item [beanService]="beanService" /> </td>
          <td> <a-start-update-button [item]=item [beanService]="beanService" /> </td>
          <td> <a-remove-button [item]=item [beanService]="beanService" (removed)="removed()" /> </td>
        </tr>
      </ng-template>
    </p-table>
  `
})
export class OwnerListComponent extends BeanListComponent<Owner, Owner, Owner> {

  constructor(
    messageService: MessageService,
    beanService: OwnerService
  ) {
    super(messageService, beanService)
  }

}
