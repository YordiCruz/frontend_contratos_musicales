import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing-module';
import { Perfil } from './components/perfil/perfil';
import { User } from './components/user/user';
import { Role } from './components/role/role';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ReactiveFormsModule } from '@angular/forms';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CategoriaComponent } from './components/inventario/categoria-component/categoria-component';
import { ProductoComponent } from './components/inventario/producto-component/producto-component';

@NgModule({
  declarations: [
    Perfil,
    User,
    Role,
    CategoriaComponent,
    ProductoComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    TableModule, 
    ReactiveFormsModule,
    ProgressBarModule,
    ProgressSpinnerModule
  ]
})
export class AdminModule { }
