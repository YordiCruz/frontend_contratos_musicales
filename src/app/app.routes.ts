import { Routes } from '@angular/router';
import { Inicio } from './web/inicio/inicio';
import { Servicios } from './web/servicios/servicios';
import { Nosotros } from './web/nosotros/nosotros';
import { Contactos } from './web/contactos/contactos';
import { Error404 } from './errors/error404/error404';
import { WebLayout } from './layout/web-layout/web-layout';
import { App } from './app';
import { AppLayout } from './layout/component/app.layout';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: WebLayout,
    children: [
      {
        path: '',
        component: Inicio,
      },
      {
        path: 'servicios',
        component: Servicios,
      },
      {
        path: 'nosotros',
        component: Nosotros,
      },
      {
        path: 'contactos',
        component: Contactos,
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('./auth/auth-module').then((au) => au.AuthModule),
      },
      
    ],
  },

  {
    path: 'admin',
    component: AppLayout,
    children: [
      {
        path: '',  loadChildren: () => import('./admin/admin-module').then((ad) => ad.AdminModule),
      }
    ],
    canActivate: [authGuard]
   
  },
  {
    path: '**',
    component: Error404,
  },
];
