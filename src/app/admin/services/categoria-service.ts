import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { CategoriaInterface } from '../interfaces/categoria-interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  
  private apiUrl = environment.url_production
  http = inject(HttpClient)

  index(): Observable<CategoriaInterface[]>{
    return this.http.get<CategoriaInterface[]>(`${this.apiUrl}/categorias-especialidads`)
  }

  store(datos: CategoriaInterface): Observable<CategoriaInterface>{
    return this.http.post<CategoriaInterface>(`${this.apiUrl}/categorias`, datos)
  }

  show(id: number): Observable<CategoriaInterface>{
    return this.http.get<CategoriaInterface>(`${this.apiUrl}/categorias/${id}`)
  }

  update(id: number, datos: CategoriaInterface): Observable<CategoriaInterface>{  
    return this.http.put<CategoriaInterface>(`${this.apiUrl}/categorias/${id}`, datos)
  }

  destroy(id: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/categorias/${id}`)
  }

  
}
