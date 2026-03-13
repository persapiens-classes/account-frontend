import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { map } from 'rxjs';

// https://angular.dev/guide/routing/route-guards#canactivate
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService
    .ensureAuthenticated()
    .pipe(map((isAuthenticated) => (isAuthenticated ? true : router.createUrlTree(['/login']))));
};
