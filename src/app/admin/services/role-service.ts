import { inject, Injectable } from '@angular/core';
import { PermisosInterface } from '../interfaces/roles-permisos-interfaces';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  
    private urlBase = environment.url_production;
  private http = inject(HttpClient);

   funListar(): Observable<PermisosInterface[]> {
      return this.http.get<PermisosInterface[]>(`${this.urlBase}/roles/permisos`);
    }

}
