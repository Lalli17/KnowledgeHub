import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth';

// Guard to check if a user is logged in
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // If logged in, allow access
  }

  // If not logged in, redirect to the login page
  return router.parseUrl('/login');
};

// Guard to check if a user is an Admin
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdmin()) {
    return true; // If admin, allow access
  }

  // If not an admin, redirect to the home page
  return router.parseUrl('/');
};

// Guard to redirect admins away from Home to Dashboard
export const redirectAdminFromHomeGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAdmin()) {
    return router.parseUrl('/dashboard');
  }
  return true;
};