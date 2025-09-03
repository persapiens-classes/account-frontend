import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MenuComponent } from './menu.component';
import { HeaderComponent } from './header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout-component',
  imports: [FormsModule, RouterOutlet, HeaderComponent, MenuComponent, ToastModule, CommonModule],
  template: `
    <p-toast></p-toast>

    <app-header />

    <app-menu />

    <h2 class="mb-4 mt-4 text-2xl" [ngClass]="titleClass">{{ title }}</h2>

    <router-outlet></router-outlet>
  `,
})
export class LayoutComponent {
  title: string;
  titleClass: string;

  constructor() {
    const activatedRoute = inject(ActivatedRoute);
    this.title = activatedRoute.snapshot.data['title'];

    type TitleColor = 'blue' | 'green' | 'red';

    this.titleClass =
      {
        blue: 'text-sky-400',
        green: 'text-green-300',
        red: 'text-red-600',
      }[activatedRoute.snapshot.data['titleClass'] as TitleColor] ?? '';
  }
}
