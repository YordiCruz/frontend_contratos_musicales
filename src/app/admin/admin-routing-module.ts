import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Perfil } from './components/perfil/perfil';
import { User } from './components/user/user';
import { Role } from './components/role/role';
import { CategoriaComponent } from './components/inventario/categoria-component/categoria-component';
import { ProductoComponent } from './components/inventario/producto-component/producto-component';
import { Inventario } from './components/inventario/inventario';
import { AlmacenComponent } from './components/inventario/almacen-component/almacen-component';
import { SucursalComponent } from './components/inventario/sucursal-component/sucursal-component';
import { NotaVentaComponent } from './components/movimientos/nota-venta-component/nota-venta-component';
import { Integrantes } from './components/integrantes/integrantes';
import { Especialidades } from './components/especialidades/especialidades';
import { Reemplazos } from './components/reemplazos/reemplazos';
import { Personas } from './components/personas/personas';
import { Clientes } from './components/clientes/clientes';
import { Eventos } from './components/eventos/eventos';

const routes: Routes = [
  
  {
    path: 'perfil',
    component: Perfil
  }, 
  {
    path: 'user',
    component: User
  },
  {
    path: 'role',
    component: Role
  }, 
   {
    path: 'integrantes',
    component: Integrantes
  },

  {
    path: 'especialidades',
    component: Especialidades
  },
  {
    path: 'reemplazos',
    component: Reemplazos
  },
  {
    path: 'personas',
    component: Personas
  },
   {
    path: 'clientes',
    component: Clientes
  },

   {
    path: 'eventos',
    component: Eventos
  },

  {
    path: 'inventario',
    component: Inventario,
    children: [
      {
        path: 'categoria',
        component: CategoriaComponent
      },
      {
        path: 'producto',
        component: ProductoComponent
      },
      {
        path: 'almacenes',
        component: AlmacenComponent
      },
      {
        path: 'sucursales',
        component: SucursalComponent
      },
    ]
  },

  {
    path: 'movimientos/nota/venta',
    component: NotaVentaComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
