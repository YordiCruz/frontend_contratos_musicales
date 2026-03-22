// src/app/admin/services/eventos-service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EventosInterface } from '../interfaces/eventos-interface';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  private baseUrl = environment.url_production; // ajusta si usas otro prefijo

  constructor(private http: HttpClient) {}

  listar(): Observable<EventosInterface[]> {
    return this.http.get<EventosInterface[]>(`${this.baseUrl}/eventos`);
  }

  crear(payload: {
    id_categoria: string;
    nombre: string;
    descripcion?: string | null;
    precio_base: number;
  }): Observable<EventosInterface> {
    return this.http.post<EventosInterface>(`${this.baseUrl}/eventos`, payload);
  }

  editar(id_evento: string, payload: {
    id_categoria: string;
    nombre: string;
    descripcion?: string | null;
    precio_base: number;
  }): Observable<EventosInterface> {
    return this.http.patch<EventosInterface>(`${this.baseUrl}/eventos/${id_evento}`, payload);
  }

  changeEstado(id_evento: string, estado: 'activo' | 'inactivo' | 'planificado' | 'cancelado'):
    Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.baseUrl}/eventos/${id_evento}/estado`, { estado });
  }
}