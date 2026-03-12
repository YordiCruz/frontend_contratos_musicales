import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Register } from './register/register';
import { Login } from './login/login';
import { ReactiveFormsModule } from '@angular/forms';
import { ClientAuthRoutingModule } from './client-auth-routing-module';


@NgModule({
  declarations: [
    Register,
    Login
  ],
  imports: [
    CommonModule,
    ClientAuthRoutingModule,
    ReactiveFormsModule

  ]
})
export class ClientAuthModule { }
