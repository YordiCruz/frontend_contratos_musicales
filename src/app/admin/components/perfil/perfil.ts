import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-perfil',
  standalone: false,
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss'
})
export class Perfil {
  authservice = inject(Auth);

  perfil = signal<any > ({});
  loading = signal<boolean>(false);
  constructor() {
    this.loading.set(true);
    this.authservice.perfil().subscribe(
      (res) => {
        console.log(res)
        //this.perfil = res
        this.perfil.set(res)
        this.loading.set(false);
      },
      (error) => {
        console.log(error);
        this.loading.set(false);
      });
  }
}
