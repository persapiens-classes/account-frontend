import { Component, inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-header',
  imports: [ButtonModule, TooltipModule, MenubarModule],
  template: `
    <div class="flex items-center gap-2.5 mb-3">
      <img src="images/account.png" class="w-[70px] h-auto self-center" alt="Account logo" />
      <h1 class="font-serif italic text-3xl">Account</h1>
      <span class="ml-auto">{{ authenticatedLogin() }}</span>
      <p-button pTooltip="Logout" icon="pi pi-sign-out" (click)="logout()" severity="danger" />
    </div>
  `,
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
