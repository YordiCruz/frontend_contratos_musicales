import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { PersonaInterface } from '../../interfaces/persona-interface';
import { PersonaService } from '../../services/persona-service';
import { PrimengModule } from '../../../primeng/primeng-module';

@Component({
  selector: 'app-personas',
  imports: [PrimengModule, ReactiveFormsModule],
  templateUrl: './personas.html',
  styleUrl: './personas.scss',
})
export class Personas {

 personas = signal<PersonaInterface[]>([]);
  visible = false;

  personaSeleccionada: PersonaInterface | null = null;

  formEditar = new FormGroup({
    nombre: new FormControl('', Validators.required),
    apellido: new FormControl('', Validators.required),
    documento_identidad: new FormControl('', Validators.required),
    telefono: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email])
  });

  constructor(private personaService: PersonaService) {}

  ngOnInit() {
    this.loadPersonas();
  }

  loadPersonas() {
    this.personaService.listar().subscribe(res => {
      this.personas.set(res || []);
    });
  }

  openEdit(p: PersonaInterface) {
    this.personaSeleccionada = p;

    this.formEditar.patchValue({
      nombre: p.nombre,
      apellido: p.apellido,
      documento_identidad: p.documento_identidad,
      telefono: p.telefono,
      email: p.email
    });

    this.visible = true;
  }

  guardarEditar() {
    if (!this.personaSeleccionada) return;

    const payload: Partial<PersonaInterface> = {
  nombre: this.formEditar.value.nombre ?? '',
  apellido: this.formEditar.value.apellido ?? '',
  documento_identidad: this.formEditar.value.documento_identidad ?? '',
  telefono: this.formEditar.value.telefono ?? '',
  email: this.formEditar.value.email ?? ''
};

    this.personaService.update(this.personaSeleccionada.id, payload)
      .subscribe(() => {
        Swal.fire('Actualizado', 'Datos de persona actualizados', 'success');
        this.visible = false;
        this.loadPersonas();
      });
  }

  closeDialog() {
    this.visible = false;
    this.personaSeleccionada = null;
  }

  changeEstado(id: string, nuevoEstado: 'activo' | 'inactivo') {
    const accion = nuevoEstado === 'inactivo' ? 'Inactivar' : 'Reactivar';

    Swal.fire({
      title: `${accion} persona?`,
      text: `La persona será marcada como ${nuevoEstado}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: accion,
      cancelButtonText: 'Cancelar'
    }).then(res => {
      if (res.isConfirmed) {

        this.personaService.update(id, { estado: nuevoEstado }).subscribe(() => {

          this.personas.update(lista =>
            lista.map(p =>
              p.id === id ? { ...p, estado: nuevoEstado } : p
            )
          );

          Swal.fire('Actualizado', `La persona ahora está ${nuevoEstado}`, 'success');
        });

      }
    });
  }


  rows = 10;
first = 0;

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


}