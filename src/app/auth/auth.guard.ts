import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

// https://angular.dev/guide/routing/route-guards#canactivate
// eslint-disable-next-line sonarjs/function-return-type
export const authGuard: CanActivateFn = () => {
  return inject(AuthService).isAuthenticated() ? true : inject(Router).createUrlTree(['/login']);
};
