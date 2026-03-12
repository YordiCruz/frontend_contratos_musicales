import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing-module';
import { Perfil } from './components/perfil/perfil';
import { User } from './components/user/user';
import { Role } from './components/role/role';
import { CategoriaComponent } from './components/inventario/categoria-component/categoria-component';
import { ProductoComponent } from './components/inventario/producto-component/producto-component';
import { Inventario } from './components/inventario/inventario';
import { AlmacenComponent } from './components/inventario/almacen-component/almacen-component';
import { SucursalComponent } from './components/inventario/sucursal-component/sucursal-component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {PrimengModule} from '../primeng/primeng-module';
import { NotaVentaComponent } from './components/movimientos/nota-venta-component/nota-venta-component'
@NgModule({
  declarations: [
    Perfil,
    User,
    Role,
    CategoriaComponent,
    ProductoComponent,
    Inventario,
    AlmacenComponent,
    SucursalComponent,
    NotaVentaComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    
    //para usar ngmodel
    FormsModule,
    PrimengModule
  ],

  
})
export class AdminModule { }
