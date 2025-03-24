import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Bean } from './bean';
import { BeanService } from './bean-service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'a-start-update-button',
  imports: [CommonModule, ButtonModule, ReactiveFormsModule],
  template: `
    <p-button icon="pi pi-pencil" (onClick)="startUpdate(item)"
      pTooltip="Edit the account" [style]="{'margin-right': '15px'}"/>
  `
})
export class StartUpdateButton<T extends Bean, I, U> {
  @Input() item!: T
  @Input() beanService!: BeanService<T, I, U>
  @Input() removed!: () => void

  constructor(private messageService: MessageService,
    private router: Router) { }

  startUpdate(item: T): void {
    this.router.navigate([`${this.beanService.beansName}/edit`], { state: { bean: item } })
  }
}
