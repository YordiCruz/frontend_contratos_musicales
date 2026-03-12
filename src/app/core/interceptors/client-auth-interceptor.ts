import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { Auth } from '../services/auth';

export const ClientAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');
  const router = inject(Router);

  //auth de core/services
  const authService = inject(Auth);

  let peticion = req;
  if (token) {
    peticion = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(peticion).pipe(
    catchError((error: any) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // 🔹 si el token expiró, intentamos refrescar
        if (authService.isTokenExpiredCliente()) {
          return authService.refreshTokenCliente().pipe(
            switchMap(() => {
              const newToken = localStorage.getItem('access_token');
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` },
              });
              return next(retryReq);
            }),
            catchError(() => {
              // si falla el refresh → logout
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              localStorage.removeItem('role');
              router.navigate(['/client/client-auth/login']);
              return throwError(() => error);
            })
          );
        }

        // si no hay refresh token → logout directo
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('role');
        router.navigate(['/client/client-auth/login']);
      }
      return throwError(() => error);
    })
  );
};