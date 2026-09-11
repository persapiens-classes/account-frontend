import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '@openng/optimus-ui/button';
import { Router } from '@angular/router';
import { editPath } from '../app.paths';
import { StateTransferService } from './models-state-transfer-service';

@Component({
  selector: 'app-start-update-button',
  imports: [CommonModule, ButtonModule],
  template: `
    <p-button
      icon="pi pi-pencil"
      (onClick)="startUpdate()"
      pTooltip="Edit the account"
      class="mr-4"
      data-cy="edit-button"
    />
  `,
})
export class StartUpdateButtonComponent<T> {
  item = input.required<T>();
  routerName = input.required<string>();
  stateTransferService = input.required<StateTransferService<T>>();

  private readonly router = inject(Router);

  startUpdate(): void {
    this.stateTransferService().setState(this.item());
    this.router.navigate([`${editPath(this.routerName())}`]);
  }
}
