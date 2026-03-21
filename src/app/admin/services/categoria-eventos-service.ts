import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CategoriaEventosInterface } from '../interfaces/categoria-eventos-interface';

@Injectable({ providedIn: 'root' })
export class CategoriaEventosService {

  private baseUrl = environment.url_production; // ajusta si tu ruta es otra

  constructor(private http: HttpClient) {}

  listar(): Observable<CategoriaEventosInterface[]> {
    return this.http.get<CategoriaEventosInterface[]>(`${this.baseUrl}/categorias`);
  }

  crear(data: any): Observable<CategoriaEventosInterface> {
    return this.http.post<CategoriaEventosInterface>(`${this.baseUrl}/categorias`, data);
  }

  editar(id_categoria: string, data: any): Observable<CategoriaEventosInterface> {
    return this.http.patch<CategoriaEventosInterface>(`${this.baseUrl}/categorias/${id_categoria}`, data);
  }

changeEstado(id_categoria: string, estado: 'activo' | 'inactivo') {
  return this.http.patch(`${this.baseUrl}/categorias/${id_categoria}`, { estado });
}
}