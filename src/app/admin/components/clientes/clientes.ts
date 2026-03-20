import { Component, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from '../../../primeng/primeng-module';
import Swal from 'sweetalert2';
import { ClientInterface } from '../../interfaces/cliente-interface';
import { ClientService } from '../../services/cliente-service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  templateUrl: './clientes.html',
  imports: [PrimengModule, ReactiveFormsModule]
})
export class Clientes {

  clientes = signal<ClientInterface[]>([]);
  visible = false;
  modo: 'create' | 'edit' = 'create';

  rows = 10;
  first = 0;

  clienteSeleccionado: ClientInterface | null = null;

  preferenciasContacto = [
    { label: 'WhatsApp', value: 'whatsapp' },
    { label: 'Email', value: 'email' },
    { label: 'Teléfono', value: 'telefono' }
  ];

  // FORMULARIO IGUAL QUE USERS (persona + cliente)
  formCliente = new FormGroup({
    persona: new FormGroup({
      nombre: new FormControl('', Validators.required),
      apellido: new FormControl('', Validators.required),
      documento_identidad: new FormControl('', Validators.required),
      telefono: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email])
    }),

    cliente: new FormGroup({
      preferencia_contacto: new FormControl<string | null>(null),
      tipo_cliente: new FormControl('individual')
    })
  });

  constructor(private clientService: ClientService) {}

  ngOnInit() {
    this.loadClientes();
  }

  loadClientes() {
    this.clientService.listar().subscribe(res => {
      this.clientes.set(res || []);
    });
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  customSort(event: any) {
    event.data.sort((a: any, b: any) => {
      const value1 = event.field.split('.').reduce((o: any, i: string) => o[i], a);
      const value2 = event.field.split('.').reduce((o: any, i: string) => o[i], b);

      let result = 0;
      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

      return event.order * result;
    });
  }

  // -----------------------------
  // CREAR
  // -----------------------------
  openCreate() {
    this.modo = 'create';
    this.clienteSeleccionado = null;

    this.formCliente.reset({
      persona: {
        nombre: '',
        apellido: '',
        documento_identidad: '',
        telefono: '',
        email: ''
      },
      cliente: {
        preferencia_contacto: null,
        tipo_cliente: 'individual'
      }
    });

    this.visible = true;
  }

  // -----------------------------
  // EDITAR
  // -----------------------------
  openEdit(c: ClientInterface) {
    this.modo = 'edit';
    this.clienteSeleccionado = c;

    this.formCliente.patchValue({
      persona: {
        nombre: c.persona.nombre,
        apellido: c.persona.apellido,
        documento_identidad: c.persona.documento_identidad,
        telefono: c.persona.telefono,
        email: c.persona.email
      },
      cliente: {
        preferencia_contacto: c.preferencia_contacto,
        tipo_cliente: c.tipo_cliente
      }
    });

    this.visible = true;
  }

  // -----------------------------
  // GUARDAR (CREATE / EDIT)
  // -----------------------------
  guardar() {
    if (this.formCliente.invalid) return;

    const f = this.formCliente.value;

    const payload = {
  persona: {
    nombre: f.persona?.nombre!,
    apellido: f.persona?.apellido!,
    documento_identidad: f.persona?.documento_identidad!,
    telefono: f.persona?.telefono!,
    email: f.persona?.email!
  },

  cliente: {
    tipo_cliente: f.cliente?.tipo_cliente || 'individual',
    preferencia_contacto: f.cliente?.preferencia_contacto || null,
    origen_registro: 'web'
  }
};


    if (this.modo === 'create') {
      this.clientService.create(payload).subscribe(() => {
        Swal.fire('Creado', 'Cliente creado correctamente', 'success');
        this.visible = false;
        this.loadClientes();
      });

    } else if (this.modo === 'edit' && this.clienteSeleccionado) {
      this.clientService.update(this.clienteSeleccionado.id, payload).subscribe(() => {
        Swal.fire('Actualizado', 'Cliente actualizado correctamente', 'success');
        this.visible = false;
        this.loadClientes();
      });
    }
  }

  // -----------------------------
  // CAMBIAR ESTADO
  // -----------------------------
  changeEstado(id: string, estado: 'activo' | 'inactivo') {
    Swal.fire({
      title: `¿${estado === 'inactivo' ? 'Inactivar' : 'Reactivar'} cliente?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: estado === 'inactivo' ? 'Inactivar' : 'Reactivar'
    }).then(res => {
      if (res.isConfirmed) {
        this.clientService.changeEstado(id, estado).subscribe(() => {
          this.loadClientes();
          Swal.fire('Actualizado', `Cliente ahora está ${estado}`, 'success');
        });
      }
    });
  }

  closeDialog() {
    this.visible = false;
    this.clienteSeleccionado = null;
  }
  
}