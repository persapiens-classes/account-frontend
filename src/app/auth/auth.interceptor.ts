import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { abs, loginPath } from '../app.paths';
import { NavigateService } from '../shared/navigate-service';

export function authIntercept(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  if (req.url.includes('/images/')) {
    return next(req);
  }

  const authService = inject(AuthService);
  const navigateService = inject(NavigateService);

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
        navigateService.navigate(abs(loginPath()));
      }
      return throwError(() => error);
    }),
  );
}
