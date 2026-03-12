import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

interface Credencial{
  email: string,
  password: string
}

@Injectable({
  providedIn: 'root'
})
export class Auth {

  urlBase = environment.url_production

  urlclient = environment.url_cliente
  
  http = inject(HttpClient);
  constructor() {
    
  }

  login( credenciales: any ){
    return this.http.post(this.urlBase + '/admin-auth/login', credenciales);

  }

   login2( credenciales: any ){
    return this.http.post(this.urlclient + '/client-auth/login', credenciales);

  }

  register(datos: any){
    return this.http.post(`${this.urlBase}/auth/register`, datos);

  }

  perfil(){
    return this.http.get(`${this.urlBase}/admin-auth/profile`);
  }

   perfil2(){
    return this.http.get(`${this.urlclient}/client-auth/profile`);
  }
  
}
