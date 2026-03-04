import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export class LoginResponse {
  login: string;
  expiresIn: number;
  constructor(login: string, expiresIn: number) {
    this.login = login;
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
  private sessionExpiresAt: number | null = null;
  private sessionChecked = false;

  signin(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        `${this.apiUrl}/login`,
        { username, password },
        { withCredentials: true },
      )
      .pipe(
        tap((loginResponse) => {
          this.setSession(loginResponse);
        }),
      );
  }

  loadSession(): Observable<LoginResponse | null> {
    return this.http.get<LoginResponse>(`${this.apiUrl}/me`, { withCredentials: true }).pipe(
      tap((loginResponse) => {
        this.setSession(loginResponse);
        this.sessionChecked = true;
      }),
      catchError(() => {
        this.clearSession();
        this.sessionChecked = true;
        return of(null);
      }),
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
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
    if (this.isAuthenticated()) {
      return of(true);
    }

    if (this.sessionChecked) {
      return of(false);
    }

    return this.loadSession().pipe(map(() => this.isAuthenticated()));
  }

  authenticatedLogin(): string {
    return this.session?.login ?? '';
  }

  clearSession() {
    this.session = null;
    this.sessionExpiresAt = null;
    this.sessionChecked = true;
  }

  private setSession(loginResponse: LoginResponse) {
    this.session = loginResponse;
    this.sessionChecked = true;
    this.sessionExpiresAt = Number.isFinite(loginResponse.expiresIn)
      ? Date.now() + loginResponse.expiresIn * 1000
      : null;
  }
}
