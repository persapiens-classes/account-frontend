import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Bean } from './bean';
import { BeanService } from './bean-service';
import { catchError, Observable, of, tap } from 'rxjs';
import { AppMessageService } from '../app-message-service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'a-remove-button',
  imports: [CommonModule, ButtonModule, ReactiveFormsModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  template: `
    <p-confirmdialog 
      header="Confirm"
      acceptButtonStyleClass="p-button-danger"
      rejectButtonStyleClass="p-button-text" />
    <p-button icon="pi pi-trash" (onClick)="remove($event)"
      pTooltip="Delete the account" [style]="{'margin-right': '10px'}"/>
  `
})
export class RemoveButton<T extends Bean, I, U> {
  @Input() item!: T
  @Input() beanService!: BeanService<T, I, U>
  @Input() beanList$!: Observable<Array<T>>
  @Output() removed = new EventEmitter<void>()

  constructor(private appMessageService: AppMessageService,
    private confirmationService: ConfirmationService
  ) { }

  remove(event: Event) {
    this.confirmationService.confirm( {
      target: event.target as EventTarget,
      message: 'Are you sure you want to remove?',
      accept: () => {
        this.beanService.remove(this.item.getId()).pipe(
          tap(() => {
            this.appMessageService.addSuccessMessage(
              `${this.beanService.beanName} removed`,
              `${this.beanService.beanName} removed ok.`)
            this.removed.emit()
          }),
          catchError((error) => {
            this.appMessageService.addErrorMessage(error,
              `${this.beanService.beanName} not removed`)
            return of()
          })
        ).subscribe()
      }
    })
  }
}
