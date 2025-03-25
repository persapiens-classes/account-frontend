import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Bean } from './bean';
import { BeanService } from './bean-service';
import { catchError, Observable, of, tap } from 'rxjs';
import { AppMessageService } from '../app-message-service';

@Component({
  selector: 'a-remove-button',
  imports: [CommonModule, ButtonModule, ReactiveFormsModule],
  template: `
    <p-button icon="pi pi-trash" (onClick)="remove(item)"
      pTooltip="Delete the account" [style]="{'margin-right': '10px'}"/>
  `
})
export class RemoveButton<T extends Bean, I, U> {
  @Input() item!: T
  @Input() beanService!: BeanService<T, I, U>
  @Input() beanList$!: Observable<Array<T>>
  @Output() removed = new EventEmitter<void>()

  constructor(private appMessageService: AppMessageService) { }

  remove(item: T) {
    this.beanService.remove(item.getId()).pipe(
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
}
