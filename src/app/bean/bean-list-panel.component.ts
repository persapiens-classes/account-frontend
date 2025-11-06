import { Router } from '@angular/router';
import { Component, inject, Input } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-bean-list-panel',
  imports: [PanelModule, ButtonModule],
  template: `
    <p-panel header="List">
      <ng-template pTemplate="header">
        <div class="ml-2.5 flex w-full items-center justify-between">
          <p-button
            icon="pi pi-plus"
            (onClick)="startInsert()"
            autofocus="true"
            pTooltip="Start new owner"
          />
        </div>
      </ng-template>

      <ng-content></ng-content>
    </p-panel>
  `,
})
export class BeanListPanelComponent {
  @Input()
  routerName!: string;

  private readonly router = inject(Router);

  startInsert(): void {
    this.router.navigate([`${this.routerName}/new`]);
  }
}
