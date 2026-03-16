import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../services/user-service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateUserDto, UserInterface } from '../../interfaces/user-interface';
import Swal from 'sweetalert2';
import { PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './user.html',
  styleUrl: './user.scss',
})
export class User implements OnInit {
  userService = inject(UserService);
  visible = false;

  users = signal<UserInterface[]>([]);
  user_id: string | null = null;

  rolesOptions: { id: string; nombre: string; descripcion: string }[] = [];


userForm = new FormGroup({
  persona: new FormGroup({
    nombre: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    apellido: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    telefono: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        Validators.pattern(/^[0-9]+$/)
      ]
    }),
    documento_identidad: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/^\d{8}$/) // exactamente 8 dígitos
      ]
    }),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    })
  }),
  user: new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    password_hash: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)]
    }),
    roles: new FormControl<string[]>([], {
      nonNullable: true,
      validators: [Validators.required]
    }),
    estado: new FormControl<string>('activo', { nonNullable: true })
  })
});

  userForm2 = new FormGroup({
  email: new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email]
  }),
  password: new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(8)]
  }),
  roles: new FormControl<string[]>([], {
    nonNullable: true,
    validators: [Validators.required]
  }),
  estado: new FormControl<string>('activo', { nonNullable: true })
});


getRoles(roles: any[]): string {
  return roles?.map(r => r.nombre).join(', ');
}

  ngOnInit(): void {
    this.getUsers();
     this.loadRoles();
  }

   loadRoles() {
    this.userService.funListarRoles().subscribe((roles) => {
      this.rolesOptions = roles;
    });
  }


  getUsers() {
    this.userService.funListar().subscribe((res: UserInterface[]) => {
      this.users.set(res);
    });
  }

  showDialog() {
    this.visible = true;
  }

funGuardarUser() {
  if (this.user_id) {
    const payload = this.userForm2.value as CreateUserDto;
   
    this.userService.funModificar(this.user_id, payload).subscribe(() => {
      const rolesIds = payload.user.roles || [];
      
      if (rolesIds.length) {
        
        this.userService.assignRoles(this.user_id!, { rolesIds }).subscribe(() => {
          this.getUsers();
          this.visibleeditar = false;
          this.userForm2.reset();
          Swal.fire({ title: 'Usuario actualizado!', icon: 'success' });
        });
      } else {
        this.getUsers();
        this.visibleeditar = false;
        this.userForm2.reset();
        Swal.fire({ title: 'Usuario actualizado!', icon: 'success' });
      }
    });
  } else {
    const payload = this.userForm.value as CreateUserDto;

    this.userService.funGuardar(payload).subscribe((nuevoUsuario: UserInterface) => {
      const rolesIds = payload.user.roles || [];
      if (rolesIds.length) {
        this.userService.assignRoles(nuevoUsuario.id, { rolesIds }).subscribe(() => {
          this.getUsers();
          this.visible = false;
          this.userForm.reset();
          Swal.fire({ title: 'Usuario creado!', icon: 'success' });
        });
      } else {
        this.getUsers();
        this.visible = false;
        this.userForm.reset();
        Swal.fire({ title: 'Usuario creado!', icon: 'success' });
      }
    });
  }
  this.user_id = null;
}

  visibleeditar = false;
   funEditar(user: UserInterface) {
    this.user_id = user.id;
    this.userForm2.patchValue({
      email: user.email,
      password: '',
      roles: user.roles.map(r => r.id), // 👈 selecciona por ID
      estado: user.estado
    });
    this.visibleeditar = true;
  }



funEliminar(user: UserInterface) {
  console.log('Usuario recibido en funEliminar:', user);

  Swal.fire({
    title: '¿Inactivar usuario?',
    text: `Se marcará como inactivo a ${user.persona?.nombre ?? '(sin nombre)'} ${user.persona?.apellido ?? '(sin apellido)'}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, inactivar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.userService.funModificar2(user.id, { estado: 'inactivo' }).subscribe(() => {
        this.getUsers();
        Swal.fire({ title: 'Usuario inactivado!', icon: 'success' });
      });
    }
  });
}

// activar usuario 

funActivar(user: UserInterface) {
  Swal.fire({
    title: '¿Reactivar usuario?',
    text: `Se volverá a activar a ${user.persona?.nombre} ${user.persona?.apellido}`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, activar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.userService.activar(user.id).subscribe(() => {
        this.getUsers(); // refresca la lista
        Swal.fire({ title: 'Usuario reactivado!', icon: 'success' });
      });
    }
  });
}


  //color para estados activo inactivo
  getEstadoSeverity(estado: string) {
  switch (estado.toLowerCase()) {
    case 'activo':
      return 'success';   // verde
    case 'inactivo':
      return 'danger';    // rojo
    default:
      return 'secondary'; // gris por defecto
  }
}

//paginacion de usuarios 

first: number = 0;
rows: number = 10;

next() {
  this.first = this.first + this.rows;
}

prev() {
  this.first = this.first - this.rows;
}

reset() {
  this.first = 0;
}

pageChange(event: any) {
  this.first = event.first;
  this.rows = event.rows;
}

isLastPage(): boolean {
  return this.users ? this.first + this.rows >= this.users.length : true;
}

isFirstPage(): boolean {
  return this.users() ? this.first === 0 : true;
}


// ordenamiento de estado 
customSort(event: any) {
  event.data.sort((a: any, b: any) => {
    let value1 = a[event.field];
    let value2 = b[event.field];

    if (event.field === 'estado') {
      // Definimos el mapa con claves estrictas
      const orderMap: Record<'Activo' | 'Inactivo', number> = {
        Activo: 1,
        Inactivo: 2
      };

      // Forzamos a que value1 y value2 sean de tipo 'Activo' | 'Inactivo'
      value1 = orderMap[value1 as 'Activo' | 'Inactivo'] ?? 99;
      value2 = orderMap[value2 as 'Activo' | 'Inactivo'] ?? 99;
    }

    if (event.field === 'ultimo_login') {
      value1 = new Date(value1).getTime();
      value2 = new Date(value2).getTime();
    }

    let result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
    return event.order * result;
  });
}


}