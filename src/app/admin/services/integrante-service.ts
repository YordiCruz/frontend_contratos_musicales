import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IntegranteInterface } from '../interfaces/integrante-interface';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class IntegranteService {
  private readonly api = `${environment.url_production}/integrantes`;

  constructor(private http: HttpClient) {}

  completarDatosIntegrante(userId: string, data: any): Observable<any> {
    return this.http.patch(`${this.api}/completar/${userId}`, data);
  }
  listar(): Observable<IntegranteInterface[]> {
    return this.http.get<IntegranteInterface[]>(this.api);
  }

  crear(data: any): Observable<any> {
    return this.http.post(this.api, data);
  }

  editar(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.api}/${id}`, data);
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
}
