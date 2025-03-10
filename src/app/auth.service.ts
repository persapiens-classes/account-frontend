import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';

export class LoginResponse {
  token: string
  expiresIn: number
  constructor(token: string, experisIn: number) {
      this.token = token
      this.expiresIn = experisIn
  }
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = environment.apiUrl + '/login';

  constructor(private http: HttpClient) {
  }

  signin(username: string, password: string): Observable<LoginResponse> {
    return this.http.post< LoginResponse >(this.apiUrl, { username, password }).pipe(
      tap((loginResponse) => {
        localStorage.setItem('token', loginResponse.token)
      })
    )
  }

  logout() {
    localStorage.removeItem('token')
  }

  isAuthenticated() {
    return this.authenticatedToken() !== null
  }

  authenticatedLogin(): string {
    const decodedToken: any = jwtDecode(this.authenticatedToken()!)
    return decodedToken?.sub // Usually, login is at "sub"
  }

  authenticatedToken(): string | null {
    return localStorage.getItem('token')
  }
}
