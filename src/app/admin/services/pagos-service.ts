import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagosInterface } from '../interfaces/pagos-interface';

@Injectable({
  providedIn: 'root'
})
export class PagosService {
  private baseUrl = `${environment.url_production}`; // Ajusta a tu endpoint real

  constructor(private http: HttpClient) {}

  listarPagos(contratoId: string): Observable<PagosInterface[]> {
    return this.http.get<PagosInterface[]>(`${this.baseUrl}/pagos`);
  }

  registrarPago(pago: PagosInterface): Observable<PagosInterface> {
    return this.http.post<PagosInterface>(this.baseUrl, pago);
  }

  confirmarPago(id_pago: string): Observable<PagosInterface> {
    return this.http.patch<PagosInterface>(`${this.baseUrl}/confirmar/${id_pago}`, {});
  }
}