import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  urlBase = environment.url_production;

  http = inject(HttpClient);

  funListar(id_almacen: string, page: number=1, limit: number = 10, search: string = ''){
    return this.http.get(`${this.urlBase}/producto?almacen=${id_almacen}&page=${page}&limit=${limit}&search=${search}`);
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