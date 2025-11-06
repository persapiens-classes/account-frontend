import { Bean } from './bean';
import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-detail-button',
  imports: [CommonModule, ButtonModule],
  template: `
    <p-button
      icon="pi pi-search"
      (onClick)="startDetail(item)"
      pTooltip="Detail the account"
      class="mr-4"
    />
  `,
})
export class StartDetailButtonComponent<T extends Bean> {
  @Input() item!: T;
  @Input() routerName!: string;

  private readonly router = inject(Router);

  startDetail(item: T): void {
    this.router.navigate([`${this.routerName}/detail`], { state: { bean: item } });
  }
}
