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
