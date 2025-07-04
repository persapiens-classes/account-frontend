import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { AutoFocusModule } from 'primeng/autofocus';
import { PasswordModule } from 'primeng/password';
import { AuthService } from './auth.service';
import { ToastModule } from 'primeng/toast';
import { catchError, of, tap } from 'rxjs';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputFieldComponent } from '../field/input-field.component';
import { AppMessageService } from '../app-message-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FloatLabelModule,
    PanelModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ReactiveFormsModule,
    RouterModule,
    AutoFocusModule,
    ToastModule,
    InputFieldComponent,
  ],
  template: `
    <p-panel class="container">
      <div class="container">
        <img src="images/account.png" class="login-image" alt="Account logo" />
        <h1>Welcome to Account</h1>

        <form [formGroup]="form">
          <app-input-field
            label="Username"
            [autoFocus]="true"
            [control]="form.get('inputUsername')!"
          />

          <p-float-label variant="in" class="margin-bottom">
            <p-password
              id="password"
              [toggleMask]="true"
              [feedback]="false"
              formControlName="inputPassword"
            />
            <label for="password">Password</label>
          </p-float-label>

          <p-button label="Sign In" (onClick)="signin()" [disabled]="form.invalid"></p-button>
        </form>

        <p-toast></p-toast>
      </div>
    </p-panel>
  `,
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  form: FormGroup;

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly appMessageService = inject(AppMessageService);

  constructor() {
    this.form = inject(FormBuilder).group({
      inputUsername: ['', [Validators.required, Validators.minLength(1)]],
      inputPassword: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  signin() {
    if (this.form.valid) {
      this.authService
        .signin(this.form.value.inputUsername, this.form.value.inputPassword)
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
