import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SucursalesService {

   urlBase =  environment.url_production

  http = inject(HttpClient);


  funListar(){

    return this.http.get(`${this.urlBase}/sucursal`);

  }

  funGuardar(datos: any){
    return this.http.post(`${this.urlBase}/sucursal`, datos);

  }

  funModificar(id: number, datos: any){
    return this.http.put(`${this.urlBase}/sucursal/${id}`, datos);
  }

  funEliminar(id:number){
    return this.http.delete(`${this.urlBase}/sucursal/${id}`);

  }

  
}
