import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientInterface } from '../interfaces/cliente-interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private baseUrl = environment.url_production;

  constructor(private http: HttpClient) {}

  listar(): Observable<ClientInterface[]> {
    return this.http.get<ClientInterface[]>(`${this.baseUrl}/clients`);
  }

 create(data: any) {
  return this.http.post<ClientInterface>(`${this.baseUrl}/clients`, data);
}

update(id: string, data: any) {
  return this.http.patch<ClientInterface>(`${this.baseUrl}/clients/${id}`, data);
}

  changeEstado(id: string, estado: 'activo' | 'inactivo'): Observable<ClientInterface> {
    return this.update(id, { estado });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/clients/${id}`);
  }
}