import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { form, Field, required, minLength } from '@angular/forms/signals';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { AutoFocusModule } from 'primeng/autofocus';
import { AuthService } from './auth.service';
import { ToastModule } from 'primeng/toast';
import { catchError, of, tap } from 'rxjs';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AppMessageService } from '../app-message-service';
import { InputFieldComponent } from '../field/input-field.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FloatLabelModule,
    PanelModule,
    ButtonModule,
    InputTextModule,
    RouterModule,
    AutoFocusModule,
    ToastModule,
    Field,
    InputFieldComponent,
  ],
  template: `
    <p-panel class="mx-auto w-100">
      <div class="flex flex-col items-center p-5">
        <img
          src="images/account.png"
          class="mt-6 mb-8 h-auto w-17.5 self-center"
          alt="Account logo"
        />
        <h1 class="mb-4 text-[1.5em] font-bold">Welcome to Account</h1>

        <form>
          <app-input-field
            label="Username"
            [autoFocus]="true"
            [field]="form.username"
            dataCy="login-username"
          />
          <app-input-field
            label="Password"
            type="password"
            [field]="form.password"
            dataCy="login-password"
          />

          <p-button
            label="Sign In"
            (onClick)="signin()"
            [disabled]="!form().valid()"
            data-cy="login-button"
          ></p-button>
        </form>

        <p-toast data-cy="error-toast"></p-toast>
      </div>
    </p-panel>
  `,
})
export class LoginPageComponent {
  form = form(signal({ username: '', password: '' }), (f) => {
    required(f.username);
    required(f.password);
    minLength(f.username, 1);
    minLength(f.password, 3);
  });

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly appMessageService = inject(AppMessageService);

  signin() {
    if (this.form().valid()) {
      this.authService
        .signin(this.form().value().username, this.form().value().password)
        .pipe(
          tap(() => {
            this.router.navigate(['balances/list']);
          }),
          catchError((error) => {
            this.appMessageService.addErrorMessage(
              error,
              'Sign in failed',
              'Invalid credenciais, please try again.',
            );
            return of();
          }),
        )
        .subscribe();
    }
  }
}
