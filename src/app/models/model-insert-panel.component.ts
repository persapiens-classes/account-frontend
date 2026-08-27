import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { FieldTree } from '@angular/forms/signals';
import { ButtonModule } from '@openng/optimus-ui/button';
import { PanelModule } from '@openng/optimus-ui/panel';
import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { ModelInsertService } from './model-insert-service';
import { AppMessageService } from '../app-message-service';
import { detailPath } from '../app.paths';

@Component({
  selector: 'app-model-insert-panel',
  imports: [ButtonModule, PanelModule, CommonModule],
  template: `
    <form (submit)="onSubmit($event)">
      <p-panel header="New">
        <ng-content></ng-content>

        <p-button
          icon="pi pi-check"
          (onClick)="insert()"
          class="mr-3"
          [disabled]="!form()().valid()"
          pTooltip="Save"
          data-cy="save-button"
        />
        <p-button
          icon="pi pi-list"
          (onClick)="cancelInsert()"
          pTooltip="Cancel to list"
          data-cy="list-button"
        />
      </p-panel>
    </form>
  `,
})
export class ModelInsertPanelComponent<F, T, I> {
  form = input.required<FieldTree<F>>();

  createModel = input.required<() => I>();

  modelIdFn = input.required<(t: T) => string>();

  modelInsertService = input.required<ModelInsertService<T, I>>();

  modelName = input.required<string>();

  routerName = input.required<string>();

  private readonly router = inject(Router);
  private readonly appMessageService = inject(AppMessageService);

  insert() {
    if (this.form()().valid()) {
      this.modelInsertService()
        .insert(this.createModel()())
        .pipe(
          catchError((error) => {
            this.appMessageService.addErrorMessage(error, `${this.modelName()} not inserted`);
            return of();
          }),
          tap((model) => {
            this.appMessageService.addSuccessMessage(
              `${this.modelName()} inserted`,
              `${this.modelName()} ${this.modelIdFn()(model)} inserted ok.`,
            );
            this.router.navigate([`${detailPath(this.routerName())}`], {
              state: { model: model },
            });
          }),
        )
        .subscribe();
    }
  }

  cancelInsert() {
    this.router.navigate([`${this.routerName()}`]);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.insert();
  }
}
