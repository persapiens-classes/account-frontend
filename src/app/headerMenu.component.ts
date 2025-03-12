import { Component, Input } from '@angular/core';
import { AuthService } from './auth.service';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'headerMenu',
  imports: [ButtonModule, TooltipModule, MenubarModule],
  template: `
    <div style="display: flex; align-items: center; gap: 10px;">
      <h1>Hello, {{ authenticatedLogin() }}</h1>
      <p-button pTooltip="Logout" icon="pi pi-sign-out" (click)="logout()" severity="danger" />
    </div>
    <p-menubar [model] = "items" />
  `
})
export class HeaderMenuComponent {
  items: MenuItem[]

  constructor(private authService: AuthService, 
    private router: Router
  ) {
    this.items = [
      {
        label: 'Owner',
        icon: 'pi pi-users',
        routerLink: ['/owners']
      },
      {
        label: 'Category',
        icon: 'pi pi-folder',
        routerLink: ['/categories']
      }
    ]
  }

  authenticatedLogin() {
    return this.authService.authenticatedLogin()
  }

  logout() {
    this.authService.logout()
    this.router.navigate(["login"])
  }
}
