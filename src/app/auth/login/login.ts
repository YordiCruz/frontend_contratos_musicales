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
    email: new FormControl('', [Validators.email, Validators.required]),
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
    // con el if valido si el formulario es valido y recien hace la peticion a la api
    if (this.loginForm.invalid) return;

    this.cargando = true;

    const { email, password } = this.loginForm.value;

    this.authservice.login({ email, password }).subscribe(
      (res: any) => {
        console.log(res);
        this.cargando = false;

        localStorage.setItem('access_token', res.access_token);

        this.router.navigate(['/admin/perfil']);

      },
      (error) => {
        console.log(error);
        this.cargando = false;
        alert("Error de Credenciales");
      }
    );

    // otra forma

    // this.authservice
    //   .login({ email, password })
    //   .subscribe({next: (res) => {
    //     this.cargando = false;
    //     console.log(res);
        

    //   }, error: (error) => {
    //     this.cargando = false;
    //     console.log(error.error);
    //   }});
  }
}
