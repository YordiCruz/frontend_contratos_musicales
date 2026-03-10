import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Auth } from '../../core/services/auth';
import { Router } from '@angular/router';

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

  // FormBuilder
  loginForm2 = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  funcIngresar() {
  if (this.loginForm.invalid) return;

  this.cargando = true;

  const { email, password } = this.loginForm.value;

  this.authservice.login({ email, password }).subscribe(
    (res: any) => {
      this.cargando = false;

      // Guardar token y rol
      localStorage.setItem('access_token', res.access_token);
      localStorage.setItem('role', res.user.role);

      // Normalizar rol
      const role = res.user.role.toLowerCase();

      // Redirección según rol
      if (role === 'admin') {
        this.router.navigate(['/admin/perfil']);
      } else if (role === 'cliente') {
        this.router.navigate(['/cliente/dashboard']);
      } else {
        alert('Rol no reconocido');
      }
    },
    (error) => {
      console.log(error);
      this.cargando = false;
      alert("Error de Credenciales");
    }
  );
}



}
