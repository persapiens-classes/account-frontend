import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Account } from './account';
import { HttpClient } from '@angular/common/http';
import { AccountService } from './account-service';
import { BeanListComponent } from '../bean/bean-list.component';
import { StartDetailButton } from "../bean/start-detail-button";
import { RemoveButton } from "../bean/remove-button";
import { StartUpdateButton } from "../bean/start-update-button";

@Component({
  selector: 'account-list',
  imports: [AsyncPipe, ButtonModule, TableModule, TooltipModule, ButtonModule, RemoveButton, StartDetailButton, StartUpdateButton],
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
          <td> <a-start-detail-button [item]=item [beanService]="beanService" /> </td>
          <td> <a-start-update-button [item]=item [beanService]="beanService" /> </td>
          <td> <a-remove-button [item]=item [beanService]="beanService" [beanList$]="beansList$" /> </td>
        </tr>
      </ng-template>
    </p-table>
  `
})
export class AccountListComponent extends BeanListComponent<Account, Account, Account> {

  constructor(
    http: HttpClient,
    route: ActivatedRoute
  ) {
    super(new AccountService(http, route.snapshot.data['type']))
  }

}
