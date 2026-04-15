import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContratosInterface } from '../interfaces/contratos-interface';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ContratosService {
  private apiUrl = `${environment.url_production}`;

  constructor(private http: HttpClient) {}

  getDisponibilidadPorDia(fecha: string) {
  return this.http.get<any[]>(`${this.apiUrl}/disponibilidad/dia/${fecha}`);
}

  getDisponibilidadPorMes(año: number, mes: number) {
  return this.http.get<any[]>(`${this.apiUrl}/disponibilidad/${año}/${mes}`);
}
  getCalculoContrato(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/contratos/${id}/calculo`);
  }

  calcularPreview(data: { lat: number; lng: number }) {
  return this.http.post<any>(`${this.apiUrl}/contratos/calcular-preview`, data);
}


  // Obtener contratos
  getContratos(): Observable<ContratosInterface[]> {
    return this.http.get<ContratosInterface[]>(`${this.apiUrl}/contratos`);
  }

  // Crear contrato
  crearContrato(contrato: Partial<ContratosInterface>): Observable<any> {
    return this.http.post(`${this.apiUrl}/contratos`, contrato);
  }

  // Confirmar contrato
  confirmarContrato(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/contratos/${id}/confirmar`, {});
  }

  // Cancelar contrato
  cancelarContrato(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/contratos/${id}/cancelar`, {});
  }

}

