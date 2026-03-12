import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Auth } from '../../../core/services/auth';
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
  // loginForm2 = this.fb.group({
  //   email: ['', [Validators.email, Validators.required]],
  //   password: ['', [Validators.required, Validators.minLength(6)]],
  // });

 funcIngresar() {
  if (this.loginForm.invalid) return;

  this.cargando = true;
  const { email, password } = this.loginForm.value;

  // Si este login es para cliente

  this.authservice.login({ email: email ?? '' , password: password ?? '' }).subscribe(
  (res: any) => {
    localStorage.setItem('access_token', res.access_token);
    localStorage.setItem('role', res.user.role.toLowerCase());

    if (res.user.role.toLowerCase() === 'admin') {
      this.router.navigate(['/admin/perfil']);
    } else {
      alert('Este login es solo para administradores');
    }
  },
  (error) => {
    this.loginForm.reset();
    alert("Error de Credenciales");
  }
);
 

}



}
