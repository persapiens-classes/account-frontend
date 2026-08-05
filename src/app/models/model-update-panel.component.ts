import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { ButtonModule } from '@openng/optimus-ui/button';
import { PanelModule } from '@openng/optimus-ui/panel';
import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { ModelUpdateService } from './model-update-service';
import { AppMessageService } from '../app-message-service';
import { FieldTree } from '@angular/forms/signals';

@Component({
  selector: 'app-model-update-panel',
  imports: [ButtonModule, PanelModule, CommonModule],
  template: `
    <form (submit)="onSubmit($event)">
      <p-panel header="Edit">
        <ng-content></ng-content>

        <p-button
          icon="pi pi-check"
          (onClick)="update()"
          class="mr-3"
          [disabled]="form()().invalid()"
          pTooltip="Save the category"
          data-cy="save-button"
        />
        <p-button
          icon="pi pi-list"
          (onClick)="cancelToList()"
          class="mr-3"
          pTooltip="Cancel to list"
          data-cy="list-button"
        />
        <p-button
          icon="pi pi-search"
          (onClick)="cancelToDetail()"
          pTooltip="Cancel to detail"
          data-cy="detail-button"
        />
      </p-panel>
    </form>
  `,
})
export class ModelUpdatePanelComponent<F, T, U> {
  form = input.required<FieldTree<F>>();

  modelFromHistory = input.required<T>();

  createModel = input.required<() => U>();

  modelIdFn = input.required<(t: T) => string>();

  modelUpdateService = input.required<ModelUpdateService<T, U>>();

  modelName = input.required<string>();

  routerName = input.required<string>();

  private readonly router = inject(Router);
  private readonly appMessageService = inject(AppMessageService);

  update() {
    if (this.form()().valid()) {
      this.modelUpdateService()
        .update(this.modelIdFn()(this.modelFromHistory()), this.createModel()())
        .pipe(
          tap((model) => {
            this.appMessageService.addSuccessMessage(
              `${this.modelName()} edited`,
              `${this.modelName()} ${this.modelIdFn()(this.modelFromHistory())} edited ok.`,
            );
            this.router.navigate([`${this.routerName()}/detail`], {
              state: { model: model },
            });
          }),
          catchError((error) => {
            this.appMessageService.addErrorMessage(error, `${this.modelName()} not edited`);
            return of();
          }),
        )
        .subscribe();
    }
  }

  cancelToList() {
    this.router.navigate([`${this.routerName()}`]);
  }

  cancelToDetail() {
    this.router.navigate([`${this.routerName()}/detail`], {
      state: { model: this.modelFromHistory() },
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.update();
  }
}
