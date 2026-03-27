import { Component, signal } from '@angular/core';
import { PrimengModule } from '../../../primeng/primeng-module';
import { ClientInterface } from '../../interfaces/cliente-interface';
import { ClientService } from '../../services/cliente-service';
import Swal from 'sweetalert2';
import { ReactiveFormsModule } from '@angular/forms';
import { ClientesForm } from './form/clientes-form';

@Component({
  selector: 'app-clientes',
  standalone: true,
  templateUrl: './clientes.html',
  imports: [PrimengModule, ReactiveFormsModule, ClientesForm]
})
export class Clientes {

  clientes = signal<ClientInterface[]>([]);
  rows = 10;
  first = 0;

  clienteSeleccionado: ClientInterface | null = null;
  visibleForm = false; // controla el diálogo del formulario

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
    this.clienteSeleccionado = null;
    this.visibleForm = true; // abre el diálogo con <app-cliente-form>
  }

  // -----------------------------
  // EDITAR
  // -----------------------------
  openEdit(c: ClientInterface) {
    this.clienteSeleccionado = c;
    this.visibleForm = true; // abre el diálogo con <app-cliente-form> en modo edición
  }

  // -----------------------------
  // RECIBIR EVENTO DEL FORMULARIO
  // -----------------------------
  onClienteGuardado(cliente: ClientInterface) {
    this.visibleForm = false;
    this.loadClientes(); // recarga la tabla
    Swal.fire('Actualizado', 'Cliente guardado correctamente', 'success');
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
}
