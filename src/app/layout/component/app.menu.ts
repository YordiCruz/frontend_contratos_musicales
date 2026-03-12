import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Administración',
                items: [
                    { label: 'Admin', icon: 'pi pi-fw pi-home', routerLink: ['/admin'] },
                    { label: 'Perfil', icon: 'pi pi-fw pi-home', routerLink: ['/admin/perfil'] },

                ]


            },
            {
                label: 'Seguridad',
                items: [
                    { label: 'Usuarios', icon: 'pi pi-fw pi-id-card', routerLink: ['/admin/user'] },
                    { label: 'Roles y Permisos', icon: 'pi pi-fw pi-check-square', routerLink: ['/admin/role'] },

                ]
            },

             {
                label: 'Inventarios',
                items: [
                    { label: 'Categorias', icon: 'pi pi-fw pi-check-square', routerLink: ['/admin/inventario/categoria'] },
                    { label: 'Productos', icon: 'pi pi-box', class: 'rotated-icon', routerLink: ['/admin/inventario/producto'] },
                    { label: 'Almacenes', icon: 'pi pi-fw pi-table', routerLink: ['/admin/inventario/almacenes'] },
                    { label: 'Sucursales', icon: 'pi pi-fw pi-table', routerLink: ['/admin/inventario/sucursales'] },
                    
                ]
            },


            {
                label: 'Pedidos',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                    {
                        label: 'Ventas',
                        icon: 'pi pi-fw pi-globe',
                        routerLink: ['/admin/movimientos/nota/venta'],
                    },
                  
                ]
            },
         
        ];
    }
}
