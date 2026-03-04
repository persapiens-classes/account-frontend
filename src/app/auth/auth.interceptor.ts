import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export function authIntercept(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  if (req.url.includes('/images/')) {
    return next(req);
  }

  const authService = inject(AuthService);
  const router = inject(Router);

  const shouldSendCredentials = req.url.startsWith(environment.apiUrl);
  const request = shouldSendCredentials ? req.clone({ withCredentials: true }) : req;

  return next(request).pipe(
    catchError((error) => {
      if (error?.status === 401) {
        authService.clearSession();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    }),
  );
}
