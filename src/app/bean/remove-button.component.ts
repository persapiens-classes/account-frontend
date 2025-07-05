import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Bean } from './bean';
import { catchError, of, tap } from 'rxjs';
import { AppMessageService } from '../app-message-service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { BeanRemoveService } from './bean-remove-service';

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
      [style]="{ 'margin-right': '10px' }"
    />
  `,
})
export class RemoveButtonComponent<T extends Bean> {
  @Input() item!: T;
  @Input() beanRemoveService!: BeanRemoveService;
  @Input() beanName!: string;
  @Output() removed = new EventEmitter<void>();

  private readonly appMessageService = inject(AppMessageService);
  private readonly confirmationService = inject(ConfirmationService);

  remove(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to remove?',
      accept: () => {
        this.beanRemoveService
          .remove(this.item.getId())
          .pipe(
            tap(() => {
              this.appMessageService.addSuccessMessage(
                `${this.beanName} removed`,
                `${this.beanName} removed ok.`,
              );
              this.removed.emit();
            }),
            catchError((error) => {
              this.appMessageService.addErrorMessage(error, `${this.beanName} not removed`);
              return of();
            }),
          )
          .subscribe();
      },
    });
  }
}
