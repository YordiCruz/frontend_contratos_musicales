import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { Auth } from '../services/auth';

export const AdminAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(Auth);

  const url = req.url;
  console.log("INTERCEPTOR URL:", url);

  // 🚫 Ignorar todo lo que NO sea admin
  if (!url.includes('/admin/')) {
    console.log("NO ES ADMIN → interceptor ignorado");
    return next(req);
  }

  // 🚫 Ignorar login y refresh admin
  if (url.includes('/admin-auth/login') || url.includes('/admin-auth/refresh')) {
    console.log("LOGIN/REFRESH ADMIN → interceptor ignorado");
    return next(req);
  }

  const token = localStorage.getItem('access_token');
  let request = req;

  // agregar token si existe
  if (token) {
    request = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(request).pipe(
    catchError((error: any) => {
      console.log("INTERCEPTOR ERROR:", error.status, url);

      if (error instanceof HttpErrorResponse && error.status === 401) {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        const role = localStorage.getItem('role');

        console.log("ACCESS TOKEN:", accessToken);
        console.log("REFRESH TOKEN:", refreshToken);
        console.log("ROLE:", role);

        // 🚫 No refrescar si no hay tokens
        if (!accessToken || !refreshToken) {
          console.log("NO HAY TOKENS → no refresh");
          return throwError(() => error);
        }

        // 🚫 Solo admins pueden refrescar
        if (role !== 'admin') {
          console.log("NO ES ADMIN → no refresh");
          return throwError(() => error);
        }

        // Si el token expiró → intentar refresh
        if (authService.isTokenExpired()) {
          console.log("TOKEN EXPIRADO → intentando refresh");
          return authService.refreshToken().pipe(
            switchMap((res: any) => {
              console.log("REFRESH OK");
              localStorage.setItem('access_token', res.access_token);

              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${res.access_token}` }
              });

              return next(retryReq);
            }),
            catchError((err) => {
              console.log("REFRESH FALLÓ → logout");
              localStorage.clear();
              router.navigate(['/admin/admin-auth/login']);
              return throwError(() => err);
            })
          );
        }
      }

      return throwError(() => error);
    })
  );
};