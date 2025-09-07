import { Component, inject, Input, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Bean } from './bean';
import { catchError, of, tap } from 'rxjs';
import { AppMessageService } from '../app-message-service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { BeanRemoveService } from './bean-remove-service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-remove-button',
  imports: [CommonModule, ButtonModule, ReactiveFormsModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  template: `
    <p-confirmdialog
      header="Confirm"
      acceptButtonStyleClass="p-button-danger"
      rejectButtonStyleClass="p-button-text"
    />
    <p-button
      icon="pi pi-trash"
      (onClick)="remove($event)"
      pTooltip="Delete the account"
      class="mr-3"
    />
  `,
})
export class RemoveButtonComponent<T extends Bean> {
  @Input() beansList!: WritableSignal<T[]>;
  @Input() item!: T;
  @Input() beanRemoveService!: BeanRemoveService;
  @Input() beanName!: string;

  private readonly appMessageService = inject(AppMessageService);
  private readonly confirmationService = inject(ConfirmationService);

  remove(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to remove?',
      accept: () => this.handleRemove(),
    });
  }

  private handleRemove() {
    this.beanRemoveService
      .remove(this.item.getId())
      .pipe(
        tap(() => this.onRemoveSuccess()),
        catchError((error) => this.onRemoveError(error)),
      )
      .subscribe();
  }

  private onRemoveSuccess() {
    this.appMessageService.addSuccessMessage(
      `${this.beanName} removed`,
      `${this.beanName} removed ok.`,
    );
    this.beansList.update((list: T[]) => list.filter((b) => b.getId() !== this.item.getId()));
  }

  private onRemoveError(error: HttpErrorResponse) {
    this.appMessageService.addErrorMessage(error, `${this.beanName} not removed`);
    return of();
  }
}
