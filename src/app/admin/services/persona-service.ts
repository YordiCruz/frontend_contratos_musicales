import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PersonaInterface } from '../interfaces/persona-interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  private baseUrl = environment.url_production; // ajusta si usas env

  constructor(private http: HttpClient) {}

  /** LISTAR PERSONAS */
  listar(): Observable<PersonaInterface[]> {
    return this.http.get<PersonaInterface[]>(`${this.baseUrl}/personas`);
  }

  /** EDITAR PERSONA */
  update(id: string, data: Partial<PersonaInterface>): Observable<PersonaInterface> {
    return this.http.patch<PersonaInterface>(`${this.baseUrl}/personas/${id}`, data);
  }

}