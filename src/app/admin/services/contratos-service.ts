import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContratosInterface } from '../interfaces/contratos-interface';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ContratosService {
  private apiUrl = `${environment.url_production}/contratos`;

  constructor(private http: HttpClient) {}

  // Obtener contratos
  getContratos(): Observable<ContratosInterface[]> {
    return this.http.get<ContratosInterface[]>(this.apiUrl);
  }

  // Crear contrato
  crearContrato(contrato: Partial<ContratosInterface>): Observable<any> {
    return this.http.post(this.apiUrl, contrato);
  }

  // Confirmar contrato
  confirmarContrato(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/confirmar`, {});
  }

  // Cancelar contrato
  cancelarContrato(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/cancelar`, {});
  }
}