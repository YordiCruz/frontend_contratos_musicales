import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const AdminAuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('access_token');
  const role = localStorage.getItem('role');

  if (token && role === 'admin') {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp > now) {
        return true; // ✅ token válido y no expirado
      }
    } catch (e) {
      console.error('Error decodificando token', e);
    }
  }

  // 🔹 token ausente o expirado
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('role');
  return router.parseUrl('/admin-auth/login');
};