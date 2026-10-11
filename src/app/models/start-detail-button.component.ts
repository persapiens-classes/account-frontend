import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '@openng/optimus-ui/button';
import { detailPath } from '../app.paths';
import { StateTransferService } from './models-state-transfer-service';
import { NavigateService } from '../shared/navigate-service';

@Component({
  selector: 'app-start-detail-button',
  imports: [CommonModule, ButtonModule],
  template: `
    <p-button
      icon="pi pi-search"
      (onClick)="startDetail()"
      pTooltip="Detail the account"
      class="mr-4"
      data-cy="detail-button"
    />
  `,
})
export class StartDetailButtonComponent<T> {
  item = input.required<T>();
  routerName = input.required<string>();
  stateTransferService = input.required<StateTransferService<T>>();

  private readonly navigateService = inject(NavigateService);

  startDetail(): void {
    this.stateTransferService().setState(this.item());
    this.navigateService.navigate(`${detailPath(this.routerName())}`);
  }
}
