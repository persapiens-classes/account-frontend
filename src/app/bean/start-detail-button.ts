import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Bean } from './bean';
import { BeanService } from './bean-service';
import { Router } from '@angular/router';

@Component({
  selector: 'a-start-detail-button',
  imports: [CommonModule, ButtonModule, ReactiveFormsModule],
  template: `
    <p-button icon="pi pi-search" (onClick)="startDetail(item)" 
      pTooltip="Detail the account" [style]="{'margin-right': '15px'}"/>
  `
})
export class StartDetailButton<T extends Bean, I, U> {
  @Input() item!: T
  @Input() beanService!: BeanService<T, I, U>

  constructor(private router: Router) { }

  startDetail(item: T): void {
    this.router.navigate([`${this.beanService.beansName}/detail`], { state: { bean: item } })
  }
}
