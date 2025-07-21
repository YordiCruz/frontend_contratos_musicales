import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  urlBase =  environment.url_production

  http = inject(HttpClient);


  funListar(){
    return this.http.get(`${this.urlBase}/users`);

  }

  funGuardar(datos: any){
    return this.http.post(`${this.urlBase}/users`, datos);

  }

  funModificar(id: number, datos: any){
    return this.http.put(`${this.urlBase}/users/${id}`, datos);
  }

  funEliminar(id:number){
    return this.http.delete(`${this.urlBase}/user/${id}`);

  }



}
