import { Component, inject, signal } from '@angular/core';
import { ClientAuthService } from '../../../core/services/client-auth';

@Component({
  selector: 'app-perfil',
  standalone: false,
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss'
})
export class Perfil {
  authservice = inject(ClientAuthService);

  perfil = signal<any> ({});
  loading = signal<boolean>(false);
  constructor() {
    this.loading.set(true);
    this.authservice.perfil2().subscribe(
      (res) => {
        console.log("Esto es: ", JSON.stringify(res, null, 2));
        //console.log("Esto: ", res);


        //this.perfil = res
        this.perfil.set(res);
        this.loading.set(false);
      },
      (error) => {
        console.log(error);
        this.loading.set(false);
      });
  }
}
