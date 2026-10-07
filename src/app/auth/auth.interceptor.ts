import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { abs, loginPath } from '../app.paths';
import { navigateTo } from '../shared/navigate';
import { AppMessageService } from '../app-message-service';

export function authIntercept(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  if (req.url.includes('/images/')) {
    return next(req);
  }

  const authService = inject(AuthService);
  const router = inject(Router);
  const appMessageService = inject(AppMessageService);

  const shouldAttachAuth = req.url.startsWith(environment.apiUrl);
  const token = authService.authenticatedToken();
  const request =
    shouldAttachAuth && token
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        })
      : req;

  return next(request).pipe(
    catchError((error) => {
      if (error?.status === 401) {
        authService.clearSession();
        navigateTo(router, appMessageService, abs(loginPath()));
      }
      return throwError(() => error);
    }),
  );
}
