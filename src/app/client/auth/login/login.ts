import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ClientAuthService } from '../../../core/services/client-auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  constructor(private formBuilder: FormBuilder) {}

  fb = inject(FormBuilder);
  router = inject(Router);
  authservice = inject(ClientAuthService);

  cargando = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  funcIngresar() {

    if (this.loginForm.invalid) return;

    this.cargando = true;

    const { email, password } = this.loginForm.value;

    this.authservice.login2({
      email: email ?? '',
      password: password ?? '',
    }).subscribe({

      next: (res: any) => {

        this.cargando = false;

        const role = res.user.role.toLowerCase();

        if (role !== 'cliente') {

          Swal.fire({
            icon: 'warning',
            title: 'Acceso no permitido',
            text: 'Este login es solo para clientes',
            confirmButtonText: 'Entendido'
          });

          return;
        }

        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('refresh_token', res.refresh_token);
        localStorage.setItem('role', role);

        // Toast de éxito
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Bienvenido',
          showConfirmButton: false,
          timer: 1500
        });

        this.router.navigate(['/client/perfil']);
      },

      error: (err) => {

        this.cargando = false;

        console.log("LOGIN ERROR:", err);

        this.loginForm.reset();

        Swal.fire({
          icon: 'error',
          title: 'Error de credenciales',
          text: 'El correo o la contraseña son incorrectos.',
          confirmButtonText: 'Intentar nuevamente'
        });

      }

    });
  }

}