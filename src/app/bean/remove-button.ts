import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Bean } from './bean';
import { BeanService } from './bean-service';
import { MessageService } from 'primeng/api';
import { catchError, Observable, of, tap } from 'rxjs';

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

  constructor(private messageService: MessageService) { }

  remove(item: T) {
    this.beanService.remove(item.getId()).pipe(
      tap(() => {
        this.messageService.add({
          severity: 'success',
          summary: `${this.beanService.beanName} removed`,
          detail: `${this.beanService.beanName} removed ok.`
        })
        this.removed.emit()
      }),
      catchError((error) => {
        this.messageService.add({
          severity: 'error',
          summary: `${this.beanService.beanName} not removed`,
          detail: `${this.beanService.beanName} not removed ${error.error.error}`
        })
        return of()
      })
    ).subscribe()
  }
}
