import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

export function authIntercept(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  // Verify if request is from AuthService
  if (req.url.includes('/login') || req.url.includes('/images/')) {
    return next(req); // If login, do not add token
  }

  const authService = inject(AuthService); // Injecting service

  if (authService.isTokenExpired()) {
    const router = inject(Router);
    router.navigate(['/login']); // Redirect login if token expired
    return new Observable<HttpEvent<any>>(); // Cancel the request
  }

  // If not login request, add token
  const token = authService.authenticatedToken();
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(cloned); // Continue cloned request
  }

  return next(req); // Continue with request, without authorization
}
