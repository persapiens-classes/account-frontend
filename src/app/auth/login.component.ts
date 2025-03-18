import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { AutoFocusModule } from 'primeng/autofocus';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { AuthService } from './auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [PanelModule, ButtonModule, InputTextModule, PasswordModule, ReactiveFormsModule, RouterModule, DividerModule, AutoFocusModule, ToastModule],
  providers: [MessageService],
  template: `
    <div class="container"> 
      <h1>Welcome to Account System</h1>

      <form [formGroup]="loginForm">
        <p-panel header="Login">
          <label for="username" >Username:</label>
          <input id="username" 
              pInputText 
              [pAutoFocus]="true"                 
              placeholder="Username" 
              formControlName="inputUsername" />

          <p-divider />

          <label for="password" >Password:</label>
          <p-password id="password"
              placeholder="Password" 
              [toggleMask]="true"
              [feedback]="false" 
              formControlName="inputPassword"
                />

          <p-divider />

          <p-button label="Sign In" (onClick)="signin()" [disabled]="loginForm.invalid"></p-button>
        </p-panel>
      </form>

      <!-- Toast to show error message -->
      <p-toast></p-toast>
    </div>
  `,
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup

  constructor(private router: Router,
    formBuilder: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.loginForm = formBuilder.group({
      inputUsername: ['', [Validators.required, Validators.minLength(1)]],
      inputPassword: ['', [Validators.required, Validators.minLength(1)]]
    })
  }

  signin() {
    if (this.loginForm.valid) {
      this.authService.signin(this.loginForm.value.inputUsername, this.loginForm.value.inputPassword).pipe(
        tap((loginResponse) => {
          this.router.navigate(['ownerEquityAccountInitialValues/list'])
        }),
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Sign in failed',
            detail: 'Invalid credenciais, please try again.'
          })
          return of()
        })
      ).subscribe()
    }
  }

}