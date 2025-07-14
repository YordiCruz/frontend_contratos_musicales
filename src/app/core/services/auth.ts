import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

interface Credencial{
  email: string,
  password: string
}

@Injectable({
  providedIn: 'root'
})
export class Auth {

  urlBase = "https://ventaslaravue.blumbit.net/back/public/api/v1";

  http = inject(HttpClient);
  constructor() {
    
  }

  login( credenciales: any ){
    return this.http.post(this.urlBase + '/auth/login', credenciales);

  }

  register(datos: any){
    return this.http.post(`${this.urlBase}/auth/register`, datos);

  }

  perfil(){
    return this.http.get(`${this.urlBase}/auth/profile`);
  }
  
}
