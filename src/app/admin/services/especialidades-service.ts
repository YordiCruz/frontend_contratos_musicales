import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Especialidad } from '../interfaces/especialidad';




@Injectable({
  providedIn: 'root'
})
export class EspecialidadesService {
  private baseUrl = environment.url_production; // Ajusta tu backend

  constructor(private http: HttpClient) {}

  getAll(): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(`${this.baseUrl}/especialidades`);

  }


  getById(id: string): Observable<Especialidad> {
    return this.http.get<Especialidad>(`${this.baseUrl}/categoria-especialidades/${id}`);
  }

  create(data: Partial<Especialidad>): Observable<Especialidad> {
    return this.http.post<Especialidad>(`${this.baseUrl}/especialidades`, data);
  }

  update(id: string, data: Partial<Especialidad>): Observable<Especialidad> {
    return this.http.patch<Especialidad>(`${this.baseUrl}/especialidades/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/especialidades/${id}`);
  }
}


