import { Bean } from './bean';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-detail-button',
  imports: [CommonModule, ButtonModule, ReactiveFormsModule],
  template: `
    <p-button
      icon="pi pi-search"
      (onClick)="startDetail(item)"
      pTooltip="Detail the account"
      [style]="{ 'margin-right': '15px' }"
    />
  `,
})
export class StartDetailButtonComponent<T extends Bean> {
  @Input() item!: T;
  @Input() beansName!: string;

  constructor(private router: Router) {}

  startDetail(item: T): void {
    this.router.navigate([`${this.beansName}/detail`], { state: { bean: item } });
  }
}
