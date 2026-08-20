import { Component, inject, input, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '@openng/optimus-ui/button';
import { catchError, of, tap } from 'rxjs';
import { AppMessageService } from '../app-message-service';
import { ConfirmDialogModule } from '@openng/optimus-ui/confirmdialog';
import { ConfirmationService } from '@openng/optimus-ui/api';
import { ModelRemoveService } from './model-remove-service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-remove-button',
  imports: [CommonModule, ButtonModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  template: `
    <p-confirmdialog
      header="Confirm"
      acceptButtonStyleClass="p-button-danger"
      rejectButtonStyleClass="p-button-text"
      [modal]="true"
      [appendTo]="'body'"
      data-cy="remove-confirm-dialog"
    />
    <p-button
      icon="pi pi-trash"
      (onClick)="remove($event)"
      pTooltip="Delete the account"
      class="mr-3"
      data-cy="delete-button"
    />
  `,
})
export class RemoveButtonComponent<T> {
  modelsList = input.required<WritableSignal<T[]>>();
  item = input.required<T>();
  modelRemoveService = input.required<ModelRemoveService>();
  modelName = input.required<string>();
  modelIdFn = input.required<(t: T) => string>();

  private readonly appMessageService = inject(AppMessageService);
  private readonly confirmationService = inject(ConfirmationService);

  remove(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to remove?',
      acceptButtonProps: { 'data-cy': 'remove-confirm-accept' },
      accept: () => this.handleRemove(),
    });
  }

  private handleRemove() {
    this.modelRemoveService()
      .remove(this.modelIdFn()(this.item()))
      .pipe(
        tap(() => this.onRemoveSuccess()),
        catchError((error) => this.onRemoveError(error)),
      )
      .subscribe();
  }

  private onRemoveSuccess() {
    this.appMessageService.addSuccessMessage(
      `${this.modelName()} removed`,
      `${this.modelName()} removed ok.`,
    );
    this.modelsList().update((list: T[]) =>
      list.filter((b) => this.modelIdFn()(b) !== this.modelIdFn()(this.item())),
    );
  }

  private onRemoveError(error: HttpErrorResponse) {
    this.appMessageService.addErrorMessage(error, `${this.modelName()} not removed`);
    return of();
  }
}
