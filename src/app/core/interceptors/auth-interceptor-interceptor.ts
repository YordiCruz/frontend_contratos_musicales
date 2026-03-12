import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  
  const token = localStorage.getItem('access_token');
  const router = inject(Router);

  
    const peticion = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  
  return next(peticion).pipe(tap(() => {}, 
    (error: any) => {
      if( error instanceof HttpErrorResponse ){
      if (error.status !== 401) {
        return;
      }

     if (error instanceof HttpErrorResponse && error.status === 401) {
  localStorage.removeItem('access_token');

  if (req.url.includes('/admin')) {
    router.navigate(['/admin/admin-auth/login']);
  } else if (req.url.includes('/client')) {
    router.navigate(['/client/client-auth/login']);
  } else {
    router.navigate(['/']); // fallback
  }
}
     }
    })
  
  );
};
