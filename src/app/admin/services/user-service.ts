import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { CreateUserDto, UserInterface } from '../interfaces/user-interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private urlBase = environment.url_production;
  private http = inject(HttpClient);

  funListar(): Observable<UserInterface[]> {
    return this.http.get<UserInterface[]>(`${this.urlBase}/users`);
  }

  // crear usuario (payload CreateUserDto)
  funGuardar(datos: CreateUserDto): Observable<UserInterface> {
    return this.http.post<UserInterface>(`${this.urlBase}/users`, datos);
  }

  // modificar usuario (payload CreateUserDto)
  funModificar(id: string, datos: CreateUserDto): Observable<UserInterface> {
    return this.http.patch<UserInterface>(`${this.urlBase}/users/${id}`, datos);
  }

 funModificar2(id: string, datos: Partial<UserInterface>): Observable<UserInterface> {
  return this.http.patch<UserInterface>(`${this.urlBase}/users/${id}`, datos);
}

  //activar usuario
  activar(id: string): Observable<void> {
    return this.http.patch<void>(`${this.urlBase}/users/${id}/activar`, {});
  }


  funEliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}/users/${id}`);
  }

  //listar roles
   funListarRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlBase}/roles`);
  }

  //asignar roles
  assignRoles(userId: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.urlBase}/roles/assign-roles/${userId}`, data);
  }

}