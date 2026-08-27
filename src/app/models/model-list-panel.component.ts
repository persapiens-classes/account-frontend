import { Router } from '@angular/router';
import { Component, inject, input } from '@angular/core';
import { PanelModule } from '@openng/optimus-ui/panel';
import { ButtonModule } from '@openng/optimus-ui/button';
import { newPath } from '../app.paths';

@Component({
  selector: 'app-model-list-panel',
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
            data-cy="create-button"
          />
        </div>
      </ng-template>

      <ng-content></ng-content>
    </p-panel>
  `,
})
export class ModelListPanelComponent {
  routerName = input.required<string>();

  private readonly router = inject(Router);

  startInsert(): void {
    this.router.navigate([`${newPath(this.routerName())}`]);
  }
}
