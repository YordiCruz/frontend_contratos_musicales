import { Routes } from '@angular/router';
import { Inicio } from './web/inicio/inicio';
import { Servicios } from './web/servicios/servicios';
import { Nosotros } from './web/nosotros/nosotros';
import { Contactos } from './web/contactos/contactos';
import { Error404 } from './errors/error404/error404';
import { WebLayout } from './layout/web-layout/web-layout';
import { AppLayout } from './layout/component/app.layout';
import { AdminAuthGuard } from './admin/guards/admin-auth-guard';
import { ClientAuthGuard } from './client/guards/client-auth-guard';

export const routes: Routes = [
  // 🔹 Web pública
  {
    path: '',
    component: WebLayout,
    children: [
      { path: '', component: Inicio },
      { path: 'servicios', component: Servicios },
      { path: 'nosotros', component: Nosotros },
      { path: 'contactos', component: Contactos },
    ],
  },

  // 🔹 Cliente
  {
    path: 'client',
    component: WebLayout,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./client/client-module').then((m) => m.ClientModule),
        canActivate: [ClientAuthGuard],

      },
      {
        path: 'client-auth',
        loadChildren: () =>
          import('./client/auth/client-auth-module').then((m) => m.ClientAuthModule),
      },
    ],
  },

  // 🔹 Admin
  {
    path: 'admin',
    component: AppLayout,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./admin/admin-module').then((m) => m.AdminModule),
        canActivate: [AdminAuthGuard],
      },
      
    ],

  },
  {
        path: 'admin-auth',
        loadChildren: () =>
          import('./admin/auth/admin-auth-module').then((m) => m.AdminAuthModule),
  },

  // 🔹 Error 404
  { path: '**', component: Error404 },
];