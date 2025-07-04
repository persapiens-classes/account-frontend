import { Component, inject } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-header',
  imports: [ButtonModule, TooltipModule, MenubarModule],
  template: `
    <div style="display: flex; align-items: center; gap: 10px;">
      <img src="images/account.png" class="account-image" alt="Account logo" />
      <h1 class="account-font">Account</h1>
      <span style="margin-left: auto;">{{ authenticatedLogin() }}</span>
      <p-button pTooltip="Logout" icon="pi pi-sign-out" (click)="logout()" severity="danger" />
    </div>
  `,
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  authenticatedLogin() {
    return this.authService.authenticatedLogin();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
