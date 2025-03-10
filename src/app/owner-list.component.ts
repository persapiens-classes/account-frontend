import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { catchError, Observable, of, tap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { AutoFocusModule } from 'primeng/autofocus';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { Owner } from './owner';
import { OwnerService } from './owner-service';

@Component({
  selector: 'owner-list',
  imports: [AsyncPipe, FormsModule, ButtonModule, TableModule, PanelModule, AutoFocusModule, DividerModule, TooltipModule],
  template: `
    <p-button  icon="pi pi-plus" (onClick)="startInsert()" autofocus="true" pTooltip="Start owner insert" />

    <p-divider />

    <p-panel header="List">
      <p-table 
        [value]="(ownersList$ | async)!"
        [rows]="3"
        [paginator]="true"
        [rowsPerPageOptions]="[3, 5, 10]"
      >
        <ng-template #header>
          <tr>
              <th pSortableColumn="name" style="width:20%">
                Name <p-sortIcon field="name" />
              </th>
              <th>Remove</th>
          </tr>
          <tr>
              <th>
                  <p-columnFilter
                      type="text"
                      field="name"
                      placeholder="Search by name"
                      ariaLabel="Filter Name"
                  ></p-columnFilter>
              </th>
          </tr>
        </ng-template>
        <ng-template #body let-item>
            <tr>
                <td>{{ item.name }}</td>
                <td><p-button icon="pi pi-trash" (onClick)="remove(item)" pTooltip="Delete the owner"/></td>
            </tr>
        </ng-template>
      </p-table>
    </p-panel>
  `
})
export class OwnerListComponent {
  ownersList$: Observable<Array<Owner>>

  constructor(private router: Router, 
    private messageService: MessageService,
    private ownerService: OwnerService) {
      this.ownersList$ = this.ownerService.findAll()
  }

  remove(item: Owner) {
    this.ownerService.remove(item.name).pipe(
      tap(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Owner removed',
          detail: 'Owner removed ok.'
        })
        this.ownersList$ = this.ownerService.findAll()
      }),
      catchError((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Owner not removed',
          detail: 'Owner not removed: ${error.error.error}'
        })
        return of()
      })
    ).subscribe()
  }

  startInsert(): void {
    this.router.navigate(["owners/new"])
  }
}
