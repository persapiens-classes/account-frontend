import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export class LoginResponse {
  login: string;
  token: string;
  expiresIn: number;
  constructor(login: string, token: string, expiresIn: number) {
    this.login = login;
    this.token = token;
    this.expiresIn = expiresIn;
  }
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl + '/auth';

  private readonly http = inject(HttpClient);
  private session: LoginResponse | null = null;
  private jwtToken: string | null = null;
  private sessionExpiresAt: number | null = null;

  signin(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((loginResponse) => {
        this.setSession(loginResponse);
      }),
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        this.clearSession();
      }),
      catchError(() => {
        this.clearSession();
        return of(void 0);
      }),
    );
  }

  isAuthenticated() {
    if (!this.session) return false;
    if (!this.sessionExpiresAt) return true;
    if (this.sessionExpiresAt <= Date.now()) {
      this.clearSession();
      return false;
    }
    return true;
  }

  ensureAuthenticated(): Observable<boolean> {
    return of(this.isAuthenticated());
  }

  authenticatedLogin(): string {
    return this.session?.login ?? '';
  }

  authenticatedToken(): string | null {
    return this.jwtToken;
  }

  clearSession() {
    this.session = null;
    this.jwtToken = null;
    this.sessionExpiresAt = null;
  }

  private setSession(loginResponse: LoginResponse) {
    this.session = loginResponse;
    this.jwtToken = loginResponse.token;
    this.sessionExpiresAt = Number.isFinite(loginResponse.expiresIn)
      ? Date.now() + loginResponse.expiresIn * 1000
      : null;
  }
}
