import { Router } from '@angular/router';
import { Component, inject, Input } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-bean-list-panel',
  imports: [FormsModule, PanelModule, ButtonModule],
  template: `
    <p-panel header="List">
      <ng-template pTemplate="header">
        <div class="flex justify-between items-center w-full ml-2.5">
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
