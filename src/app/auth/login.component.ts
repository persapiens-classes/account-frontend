import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { AutoFocusModule } from 'primeng/autofocus';
import { PasswordModule } from 'primeng/password';
import { AuthService } from './auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { catchError, of, tap } from 'rxjs';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FloatLabelModule, PanelModule, ButtonModule, InputTextModule, PasswordModule, ReactiveFormsModule, RouterModule, AutoFocusModule, ToastModule],
  providers: [MessageService],
  template: `
    <div class="container"> 
      <h1>Welcome to Account System</h1>

      <form [formGroup]="loginForm">
        <p-panel header="Login">
          <p-float-label variant="in" style="margin-bottom: 10px">
            <input id="username" 
                pInputText 
                [pAutoFocus]="true"                 
                formControlName="inputUsername" />
            <label for="username" >Username</label>
          </p-float-label>

          <p-float-label variant="in" style="margin-bottom: 10px">
            <p-password id="password"
                [toggleMask]="true"
                [feedback]="false" 
                formControlName="inputPassword"
                  />
            <label for="password" >Password</label>
          </p-float-label>

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