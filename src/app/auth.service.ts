import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { lastValueFrom } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = environment.apiUrl + '/login';

  constructor(private http: HttpClient) {
  }

  async signin(username: string, password: string): Promise<boolean> {
    try {
      console.log('login: ' + username)
      const response = await lastValueFrom(this.http.post<{ token: string }>(this.apiUrl, { username, password }))
      console.log('response: ' + response)
      if (response?.token) {
        localStorage.setItem('token', response.token)
        const decodedToken: any = jwtDecode(response.token)
        return true
      }
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
    return false
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
