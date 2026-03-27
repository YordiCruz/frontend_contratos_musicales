import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UbicacionInterface } from '../interfaces/ubicacion-interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {
  private apiUrl = `${environment.url_production}/ubicaciones`; // ajusta tu endpoint

  constructor(private http: HttpClient) {}

  // Crear nueva ubicación
  crearUbicacion(ubicacion: UbicacionInterface): Observable<UbicacionInterface> {
    return this.http.post<UbicacionInterface>(this.apiUrl, ubicacion);
  }

  // Obtener todas las ubicaciones
  getUbicaciones(): Observable<UbicacionInterface[]> {
    return this.http.get<UbicacionInterface[]>(this.apiUrl);
  }

  // Obtener una ubicación por ID
  getUbicacionById(id: number): Observable<UbicacionInterface> {
    return this.http.get<UbicacionInterface>(`${this.apiUrl}/${id}`);
  }

  // Actualizar ubicación existente
  actualizarUbicacion(id: string, ubicacion: UbicacionInterface): Observable<UbicacionInterface> {
    return this.http.patch<UbicacionInterface>(`${this.apiUrl}/${id}`, ubicacion);
  }

  // Eliminar ubicación
  eliminarUbicacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
