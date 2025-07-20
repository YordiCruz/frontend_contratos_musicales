import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  urlBase = 'https://ventaslaravue.blumbit.net/back/public/api';

  http = inject(HttpClient);


  funListar(){
    return this.http.get(`${this.urlBase}/user`);

  }

  funGuardar(datos: any){
    return this.http.post(`${this.urlBase}/user`, datos);

  }

  funModificar(id: number, datos: any){
    return this.http.put(`${this.urlBase}/user/${id}`, datos);
  }

  funEliminar(id:number){
    return this.http.delete(`${this.urlBase}/user/${id}`);

  }



}
