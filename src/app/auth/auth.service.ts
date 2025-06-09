import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export class LoginResponse {
  token: string;
  expiresIn: number;
  constructor(token: string, experisIn: number) {
    this.token = token;
    this.expiresIn = experisIn;
  }
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/login';

  constructor(private readonly http: HttpClient) {}

  signin(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, { username, password }).pipe(
      tap((loginResponse) => {
        localStorage.setItem('token', loginResponse.token);
      }),
    );
  }

  logout() {
    localStorage.removeItem('token');
  }

  isAuthenticated() {
    return this.authenticatedToken() !== null;
  }

  authenticatedLogin(): string {
    const decodedToken = jwtDecode<JwtPayload>(this.authenticatedToken()!);
    return decodedToken?.sub ?? ''; // Usually, login is at "sub"
  }

  getTokenExpiration(): number | null {
    const token = this.authenticatedToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.exp ? decoded.exp * 1000 : null;
    } catch (e) {
      console.log('could not decode jwt: ' + e);
      return null;
    }
  }

  isTokenExpired(): boolean {
    const expiration = this.getTokenExpiration();
    if (!expiration) return true;

    return expiration < Date.now();
  }

  authenticatedToken(): string | null {
    return localStorage.getItem('token');
  }
}
