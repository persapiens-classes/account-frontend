import { Router } from '@angular/router';
import { Bean } from './bean';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { Component, inject, input } from '@angular/core';

@Component({
  selector: 'app-bean-detail-panel',
  imports: [CommonModule, ButtonModule, PanelModule],
  template: `
    <p-panel header="Detail">
      <ng-content></ng-content>

      <p-button
        icon="pi pi-list"
        (onClick)="list()"
        class="mr-3"
        pTooltip="Back to List"
        data-cy="list-button"
      />
      <p-button
        icon="pi pi-pencil"
        (onClick)="startUpdate()"
        pTooltip="Start Edit"
        data-cy="edit-button"
      />
    </p-panel>
  `,
})
export class BeanDetailPanelComponent<T extends Bean> {
  routerName = input.required<string>();

  bean = input.required<T>();

  private readonly router = inject(Router);

  list() {
    this.router.navigate([`${this.routerName()}`]);
  }

  startUpdate() {
    this.router.navigate([`${this.routerName()}/edit`], {
      state: { bean: this.bean() },
    });
  }
}
