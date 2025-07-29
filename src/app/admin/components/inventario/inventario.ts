import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-inventario',
  standalone: false,
  templateUrl: './inventario.html',
  styleUrl: './inventario.scss'
})
export class Inventario {
 items: MenuItem[] = [
  { label: 'Categorias', routerLink: '/admin/inventario/categoria' }, 
  { label: 'Productos', routerLink: '/admin/inventario/producto' }, 
  { label: 'Almacenes', routerLink: '/admin/inventario/almacenes' }, 
  { label: 'Sucursales', routerLink: '/admin/inventario/sucursales' }
];

    home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };
}
