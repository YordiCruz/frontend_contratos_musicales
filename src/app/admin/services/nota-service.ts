import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotaService {
  urlBase = environment.url_production;

  http = inject(HttpClient);

  funListar( page: number=1, limit: number = 10, search: string = ''){
    return this.http.get(`${this.urlBase}/nota?page=${page}&limit=${limit}&search=${search}`);
  }

  funGuardar(datos: any){
    return this.http.post(`${this.urlBase}/nota`, datos);
  }

  funMostrar(id: number){
    return this.http.get(`${this.urlBase}/nota/${id}`);
  }

  funModificar(id: number, datos: any){
    return this.http.put(`${this.urlBase}/nota/${id}`, datos);
  }

  funEliminar(id: number){
    return this.http.delete(`${this.urlBase}/nota/${id}`);
  }

}