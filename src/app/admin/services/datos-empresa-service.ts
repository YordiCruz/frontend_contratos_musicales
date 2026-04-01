import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatosEmpresaInterface } from '../interfaces/datos-empresa-interface';
import { environment } from '../../../environments/environment';

// Interfaz para tipar los datos


@Injectable({
  providedIn: 'root'
})
export class DatosEmpresaService {
  private apiUrl = `${environment.url_production}/datos-empresa`; // Ajusta según tu backend

  constructor(private http: HttpClient) {}

  // Crear empresa
  crear(datos: DatosEmpresaInterface): Observable<DatosEmpresaInterface> {
    return this.http.post<DatosEmpresaInterface>(this.apiUrl, datos);
  }

  // Obtener todas las empresas (normalmente será solo una)
  obtenerTodos(): Observable<DatosEmpresaInterface[]> {
    return this.http.get<DatosEmpresaInterface[]>(this.apiUrl);
  }

  // Obtener por ID
  obtenerPorId(id: string): Observable<DatosEmpresaInterface> {
    return this.http.get<DatosEmpresaInterface>(`${this.apiUrl}/${id}`);
  }

  // Actualizar
  actualizar(id: string, datos: Partial<DatosEmpresaInterface>): Observable<DatosEmpresaInterface> {
    return this.http.put<DatosEmpresaInterface>(`${this.apiUrl}/${id}`, datos);
  }

  // Eliminar
  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Obtener ubicación base (lat/lng)
  obtenerUbicacionBase(): Observable<{ lat: number; lng: number }> {
    return this.http.get<{ lat: number; lng: number }>(`${this.apiUrl}/ubicacion/base`);
  }
}
