import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Perfil } from './perfil/perfil';

const routes: Routes = [
  {
    path: 'perfil',
    component: Perfil
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
