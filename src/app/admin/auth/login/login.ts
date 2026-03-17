import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Auth } from '../../../core/services/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // Import SweetAlert2

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
  authservice = inject(Auth);

  cargando = false;

  // FormGroup
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

    this.authservice.login({ email: email ?? '', password: password ?? '' })
      .subscribe(
        (res: any) => {
          this.cargando = false;

          // Guardar tokens y rol
          localStorage.setItem('access_token', res.access_token);
          localStorage.setItem('role', res.user.role.toLowerCase());

          // Redirigir según rol
          if (res.user.role.toLowerCase() === 'admin') {
            this.router.navigate(['/admin/perfil']);
          } else {
            this.router.navigate(['/client/perfil']);
          }
        },
        (error) => {
          this.cargando = false;
          this.loginForm.reset();

          // Usando SweetAlert2
          Swal.fire({
            icon: 'error',
            title: 'Error de Credenciales',
            text: 'El correo o la contraseña son incorrectos. Intenta de nuevo.',
            confirmButtonText: 'Aceptar',
          });
        }
      );
  }
}