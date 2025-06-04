import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Bean } from './bean';
import { Router } from '@angular/router';

@Component({
  selector: 'a-start-update-button',
  imports: [CommonModule, ButtonModule, ReactiveFormsModule],
  template: `
    <p-button
      icon="pi pi-pencil"
      (onClick)="startUpdate(item)"
      pTooltip="Edit the account"
      [style]="{ 'margin-right': '15px' }"
    />
  `,
})
export class StartUpdateButton<T extends Bean> {
  @Input() item!: T;
  @Input() beansName!: String;
  @Input() removed!: () => void;

  constructor(private router: Router) {}

  startUpdate(item: T): void {
    this.router.navigate([`${this.beansName}/edit`], { state: { bean: item } });
  }
}
