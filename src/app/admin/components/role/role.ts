import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../services/user-service';
import { PermisosInterface, RolesInterface } from '../../interfaces/roles-permisos-interfaces';
import { RoleService } from '../../services/role-service';

@Component({
  selector: 'app-role',
  standalone: false,
  templateUrl: './role.html',
  styleUrl: './role.scss'
})
export class Role {

  userService = inject(UserService);
  roleService = inject(RoleService);


  roles = signal<RolesInterface[]>([]);


  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles() {
    this.userService.funListarRoles().subscribe((res) => {
      this.roles.set(res);
    });
  }

  customSort(event: any) {
    const field = event.field;
    const order = event.order;

    event.data.sort((a: any, b: any) => {
      let value1 = a[field];
      let value2 = b[field];

      // Normalizar strings
      if (typeof value1 === 'string') value1 = value1.toLowerCase();
      if (typeof value2 === 'string') value2 = value2.toLowerCase();

      let result = 0;
      if (value1 < value2) result = -1;
      else if (value1 > value2) result = 1;

      return order * result;
    });
  }




}
