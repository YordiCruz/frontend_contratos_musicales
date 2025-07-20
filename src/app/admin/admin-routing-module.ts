import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Perfil } from './components/perfil/perfil';
import { User } from './components/user/user';
import { Role } from './components/role/role';

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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
