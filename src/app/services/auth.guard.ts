import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth';

export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const roles = route.data['roles'] as string[] | undefined;
  if (roles && roles.length > 0) {
    const user = auth.getCurrentUser();
    if (!user || !roles.includes(user.role)) {
      router.navigate(['/']);
      return false;
    }
  }

  return true;
};
