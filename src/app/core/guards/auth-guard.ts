import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  console.log('authGuard ****', route, state);
  const token = localStorage.getItem('access_token') || null;
  
  const router = inject(Router);

  if (!token) {
    router.navigate(['/auth/login']);
    return false;
  }


  return true;
};
