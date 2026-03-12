import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Perfil } from './components/perfil/perfil';
import { ClientRoutingModule } from './client-routing-module';
import { PrimengModule } from '../primeng/primeng-module';


@NgModule({
  declarations: [
    Perfil

  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    ReactiveFormsModule,


    // para usar lo de ngmodel
    PrimengModule,
    FormsModule
  ],
  exports: []
})
export class ClientModule { }
