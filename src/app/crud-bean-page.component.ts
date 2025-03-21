import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MenuComponent } from './menu.component';
import { MessageService } from 'primeng/api';
import { HeaderComponent } from './header.component';

@Component({
  selector: 'crud',
  imports: [FormsModule, RouterOutlet, HeaderComponent, MenuComponent, ToastModule],
  providers: [MessageService],
  template: `
    <a-header />

    <a-menu/>

    <h2 class="{{ titleClass }}">{{ title }}</h2>

    <router-outlet></router-outlet>

    <!-- Toast to show message -->
    <p-toast></p-toast>
  `,
  styleUrl: './crud-bean-page.component.scss'
})
export class CrudBeanPageComponent {
  title: string
  titleClass: string

  constructor(private route: ActivatedRoute) {
    this.title = this.route.snapshot.data['title']
    this.titleClass = this.route.snapshot.data['titleClass']
  }
}
