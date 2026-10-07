import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '@openng/optimus-ui/button';
import { PanelModule } from '@openng/optimus-ui/panel';
import { Component, inject, input } from '@angular/core';
import { editPath } from '../app.paths';
import { StateTransferService } from './models-state-transfer-service';
import { navigateTo } from '../shared/navigate';
import { AppMessageService } from '../app-message-service';

@Component({
  selector: 'app-model-detail-panel',
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
export class ModelDetailPanelComponent<T> {
  routerName = input.required<string>();

  model = input.required<T>();
  stateTransferService = input.required<StateTransferService<T>>();

  private readonly router = inject(Router);
  private readonly appMessageService = inject(AppMessageService);

  list() {
    navigateTo(this.router, this.appMessageService, `${this.routerName()}`);
  }

  startUpdate() {
    this.stateTransferService().setState(this.model());
    navigateTo(this.router, this.appMessageService, `${editPath(this.routerName())}`);
  }
}
