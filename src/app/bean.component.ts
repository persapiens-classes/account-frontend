import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { HeaderMenuComponent } from './headerMenu.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'model-crud',
  imports: [FormsModule, RouterOutlet, HeaderMenuComponent, ToastModule],
  providers: [MessageService],
  template: `
    <headerMenu />

    <h2>{{ title }}</h2>

    <router-outlet></router-outlet>
    <!-- Toast to show message -->
    <p-toast></p-toast>
  `
})
export class BeanComponent {
  title: string

  constructor(private route: ActivatedRoute) {
    this.title = this.route.snapshot.data['title']
  }
}
