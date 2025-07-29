import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AlmacenesService {

   urlBase =  environment.url_production

  http = inject(HttpClient);


  funListar(id_sucursal: number){

    return this.http.get(`${this.urlBase}/almacen?sucursal=${id_sucursal}`);

  }

  funGuardar(datos: any){
    return this.http.post(`${this.urlBase}/almacen`, datos);

  }

  funModificar(id: number, datos: any){
    return this.http.put(`${this.urlBase}/almacen/${id}`, datos);
  }

  funEliminar(id:number){
    return this.http.delete(`${this.urlBase}/almacen/${id}`);

  }

  
}
