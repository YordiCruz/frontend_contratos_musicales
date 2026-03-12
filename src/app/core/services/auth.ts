import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

interface Credencial {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  urlBase = environment.url_production;
  urlclient = environment.url_cliente;


  router = inject(Router) // Router
  http = inject(HttpClient);

  // 🔹 Estado de sesión
  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('access_token'));

  isLoggedIn() {
    return this.loggedIn.value;
  }

  // 🔹 Login Admin
  login(credenciales: Credencial) {
    return this.http.post(this.urlBase + '/admin-auth/login', credenciales).pipe(
      tap((res: any) => {
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('refresh_token', res.refresh_token);
        localStorage.setItem('role', res.user.role.toLowerCase());
        this.loggedIn.next(true);
      })
    );
  }

  // 🔹 Refresh Token admin
  refreshToken() {
  const refreshToken = localStorage.getItem('refresh_token');
  return this.http.post<{ access_token: string }>(
    this.urlBase + '/admin-auth/refresh',
    { refreshToken }
  ).pipe(
    tap(res => {
      localStorage.setItem('access_token', res.access_token);
    })
  );
}

// 🔹 Verificar Token
isTokenExpired(): boolean {
  const token = localStorage.getItem('access_token');
  if (!token) return true;

  const payload = JSON.parse(atob(token.split('.')[1]));
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}



  // 🔹 Login Cliente
  login2(credenciales: Credencial) {
    return this.http.post(this.urlclient + '/client-auth/login', credenciales).pipe(
      tap((res: any) => {
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('refresh_token', res.refresh_token);
        localStorage.setItem('role', res.user.role.toLowerCase());
        this.loggedIn.next(true);
      })
    );
  }

  // 🔹 Refresh Token cliente
  refreshTokenCliente() {
  const refreshToken = localStorage.getItem('refresh_token');
  return this.http.post<{ access_token: string }>(
    this.urlBase + '/client-auth/refresh',
    { refreshToken }
  ).pipe(
    tap(res => {
      localStorage.setItem('access_token', res.access_token);
    })
  );
}

// 🔹 Verificar Token cliente
isTokenExpiredCliente(): boolean {
  const token = localStorage.getItem('access_token');
  if (!token) return true;

  const payload = JSON.parse(atob(token.split('.')[1]));
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

  // 🔹 Logout
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('role');
    this.loggedIn.next(false);

    
    this.router.navigate(['client/client-auth/login']);

  }

   // 🔹 Logout admin
  logout2() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('role');
    this.loggedIn.next(false);

    
    this.router.navigate(['admin-auth/login']);

  }

  // 🔹 Perfil Admin
  perfil() {
    return this.http.get(`${this.urlBase}/admin-auth/profile`);
  }

  // 🔹 Perfil Cliente
  perfil2() {
    return this.http.get(`${this.urlclient}/client-auth/profile`);
  }
}