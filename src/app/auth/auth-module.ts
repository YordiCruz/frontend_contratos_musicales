import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing-module';
import { Register } from './register/register';
import { Login } from './login/login';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    Register,
    Login
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule

  ]
})
export class AuthModule { }
