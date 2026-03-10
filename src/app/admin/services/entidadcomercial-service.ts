import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EntidadComercialService {
  urlBase = environment.url_production;

  http = inject(HttpClient);

  funListar(search: string = ''){
    return this.http.get(`${this.urlBase}/entidad-comercial?search=${search}`);
  }

  funGuardar(datos: any){
    return this.http.post(`${this.urlBase}/producto`, datos);
  }

  funMostrar(id: number){
    return this.http.get(`${this.urlBase}/producto/${id}`);
  }

  funModificar(id: number, datos: any){
    return this.http.put(`${this.urlBase}/producto/${id}`, datos);
  }

  funEliminar(id: number){
    return this.http.delete(`${this.urlBase}/producto/${id}`);
  }

  actualizarImagen(prod: any, formdata: any) {
    return this.http.post(`${this.urlBase}/producto/${prod.id}/actualizar-imagen`, formdata)
  }
}