import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../services/user-service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateUserData, CreateUserDto, passworduser, UserInterface } from '../../interfaces/user-interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './user.html',
  styleUrl: './user.scss',
})
export class User implements OnInit {
  userService = inject(UserService);
  visible = false;
  visibleeditar = false;

  users = signal<UserInterface[]>([]);
  user_id: string | null = null;

  rolesOptions: { id: string; nombre: string; descripcion: string }[] = [];

  // FORMULARIO PARA CREAR
  userForm = new FormGroup({
    persona: new FormGroup({
      nombre: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
      apellido: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
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
        validators: [Validators.required, Validators.pattern(/^\d{8}$/)]
      }),
      email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] })
    }),

    user: new FormGroup({
      email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      password_hash: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
      roles: new FormControl<string[]>([], { nonNullable: true, validators: [Validators.required] }),
      estado: new FormControl<string>('activo', { nonNullable: true })
    })
  });

  // FORMULARIO PARA EDITAR
  userForm2 = new FormGroup({
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    roles: new FormControl<string[]>([], { nonNullable: true, validators: [Validators.required] }),
    estado: new FormControl<string>('activo', { nonNullable: true })
  });

  passwordUserForm = new FormGroup({
    newpassword: new FormControl<string>('', {validators: [ Validators.minLength(8)] })
  })



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

  // GUARDAR O EDITAR
funGuardarUser() {
  if (this.user_id) {
    // --------------------------
    //   EDITAR USUARIO
    // --------------------------
    const payload: CreateUserData = {
      email: this.userForm2.value.email!,
      roles: this.userForm2.value.roles!,
    };

 
    this.userService.funModificar(this.user_id, payload).subscribe(() => {
      const rolesIds = payload.roles;

  const newPass = this.passwordUserForm.value.newpassword?.trim();
  console.log('Valor raw del formulario:', this.passwordUserForm.value);
console.log('newPass:', newPass);

if (newPass && newPass.length >= 8) {
  const payloadpass: passworduser = { newpassword: newPass };
  this.userService.funModificarpass(this.user_id!, payloadpass).subscribe(() => {
    console.log('Contraseña actualizada');
  });
} else {
  console.log('No se actualiza la contraseña');
}
      if (rolesIds.length) {
        this.userService.assignRoles(this.user_id!, { rolesIds }).subscribe(() => {
          this.getUsers();
          this.visibleeditar = false;
          this.userForm2.reset();
          Swal.fire({ title: 'Usuario actualizado!', icon: 'success' });

          // AHORA SÍ RESETEA
          this.user_id = null;
        });
      } else {
        this.getUsers();
        this.visibleeditar = false;
        this.userForm2.reset();
        Swal.fire({ title: 'Usuario actualizado!', icon: 'success' });

        // AHORA SÍ RESETEA
        this.user_id = null;
      }
    });

  } else {
    // --------------------------
    //   CREAR USUARIO
    // --------------------------
    const payload = this.userForm.value as CreateUserDto;

    this.userService.funGuardar(payload).subscribe((nuevoUsuario: UserInterface) => {
      const rolesIds = payload.user.roles || [];

      if (rolesIds.length) {
        this.userService.assignRoles(nuevoUsuario.id, { rolesIds }).subscribe(() => {
          this.getUsers();
          this.visible = false;
          this.userForm.reset();
          Swal.fire({ title: 'Usuario creado!', icon: 'success' });

          this.user_id = null;
        });
      } else {
        this.getUsers();
        this.visible = false;
        this.userForm.reset();
        Swal.fire({ title: 'Usuario creado!', icon: 'success' });

        this.user_id = null;
      }
    });
  }
}
  // CARGAR DATOS PARA EDITAR
  funEditar(user: UserInterface) {
    this.user_id = user.id;

    this.userForm2.patchValue({
      email: user.email,
      roles: user.roles.map(r => r.id),
      estado: user.estado
    });

    this.visibleeditar = true;
  }

  // INACTIVAR
  funEliminar(user: UserInterface) {
    Swal.fire({
      title: '¿Inactivar usuario?',
      text: `Se marcará como inactivo a ${user.persona?.nombre} ${user.persona?.apellido}`,
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

  // ACTIVAR
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
          this.getUsers();
          Swal.fire({ title: 'Usuario reactivado!', icon: 'success' });
        });
      }
    });
  }

  // ESTILOS
  getEstadoSeverity(estado: string) {
    switch (estado.toLowerCase()) {
      case 'activo': return 'success';
      case 'inactivo': return 'danger';
      default: return 'secondary';
    }
  }

  // PAGINACIÓN
  first: number = 0;
  rows: number = 10;

  next() { this.first = this.first + this.rows; }
  prev() { this.first = this.first - this.rows; }
  reset() { this.first = 0; }

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

  // ORDENAMIENTO
 customSort(event: any) {
  event.data.sort((a: any, b: any) => {
    const field = event.field;

    // --- Resolver campos anidados ---
    const resolveField = (obj: any, path: string) =>
      path.split('.').reduce((acc, key) => acc?.[key], obj);

    let value1 = resolveField(a, field);
    let value2 = resolveField(b, field);

    // --- Orden especial para estado ---
    if (field === 'estado') {
      const orderMap: Record<string, number> = {
        activo: 1,
        inactivo: 2
      };
      value1 = orderMap[value1?.toLowerCase()] ?? 99;
      value2 = orderMap[value2?.toLowerCase()] ?? 99;
    }

    // --- Orden para fechas ---
    if (field === 'ultimo_login') {
      value1 = new Date(value1).getTime();
      value2 = new Date(value2).getTime();
    }

    // --- Normalizar strings ---
    if (typeof value1 === 'string') value1 = value1.toLowerCase();
    if (typeof value2 === 'string') value2 = value2.toLowerCase();

    let result = 0;
    if (value1 < value2) result = -1;
    else if (value1 > value2) result = 1;

    return event.order * result;
  });
}

  getRoles(roles: any[]): string {
  return roles?.map(r => r.nombre).join(', ');
}
}