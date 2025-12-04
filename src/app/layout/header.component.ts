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
    <div class="mb-3 flex items-center gap-2.5">
      <img src="images/account.png" class="h-auto w-[70px] self-center" alt="Account logo" />
      <h1 class="font-serif text-3xl italic">Account</h1>
      <span class="ml-auto">{{ authenticatedLogin() }}</span>
      <p-button
        pTooltip="Logout"
        icon="pi pi-sign-out"
        (click)="logout()"
        severity="danger"
        data-cy="logout-button"
      />
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
