import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MenuComponent } from './menu.component';
import { HeaderComponent } from './header.component';

@Component({
  selector: 'app-layout-component',
  imports: [FormsModule, RouterOutlet, HeaderComponent, MenuComponent, ToastModule],
  template: `
    <p-toast></p-toast>

    <app-header />

    <app-menu />

    <h2 class="{{ titleClass }}">{{ title }}</h2>

    <router-outlet></router-outlet>
  `,
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  title: string;
  titleClass: string;

  constructor() {
    const activatedRoute = inject(ActivatedRoute);
    this.title = activatedRoute.snapshot.data['title'];
    this.titleClass = activatedRoute.snapshot.data['titleClass'];
  }
}
