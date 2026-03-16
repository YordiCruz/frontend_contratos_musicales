import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { ClientAuthService } from '../services/client-auth';

export const ClientAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(ClientAuthService);

  const url = req.url;
  console.log('CLIENT INTERCEPTOR URL:', url);

  // 🚫 Ignorar todo lo que NO sea cliente
  if (!url.includes('/client/')) {
    console.log('NO ES CLIENTE → interceptor ignorado');
    return next(req);
  }

  // 🚫 Ignorar login y refresh cliente
  if (url.includes('/client-auth/login') || url.includes('/client-auth/refresh')) {
    console.log('LOGIN/REFRESH CLIENT → interceptor ignorado');
    return next(req);
  }

  const token = localStorage.getItem('access_token');
  let request = req;

  // agregar token si existe
  if (token) {
    request = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(request).pipe(
    catchError((error: any) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        const role = localStorage.getItem('role');

        console.log('ACCESS TOKEN:', accessToken);
        console.log('REFRESH TOKEN:', refreshToken);
        console.log('ROLE:', role);

        // 🚫 No refrescar si no hay tokens o rol no es cliente
        if (!accessToken || !refreshToken || role !== 'cliente') {
          console.log('NO HAY TOKENS O NO ES CLIENTE → no refresh');
          return throwError(() => error);
        }

        // Si el token expiró → intentar refresh
        if (authService.isTokenExpiredCliente()) {
          console.log('TOKEN EXPIRADO CLIENTE → intentando refresh');
          return authService.refreshTokenCliente().pipe(
            switchMap((res: any) => {
              console.log('REFRESH CLIENTE OK');
              localStorage.setItem('access_token', res.access_token);

              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${res.access_token}` },
              });

              return next(retryReq);
            }),
            catchError((err) => {
              console.log('REFRESH CLIENTE FALLÓ → logout');
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              localStorage.removeItem('role');
              router.navigate(['/client/client-auth/login']);
              return throwError(() => err);
            })
          );
        }

        // si no hay refresh token → logout directo
        console.log('NO ES NECESARIO REFRESH → logout');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('role');
        router.navigate(['/client/client-auth/login']);
      }

      return throwError(() => error);
    })
  );
};