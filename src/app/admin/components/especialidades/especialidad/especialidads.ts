import { Component, signal } from '@angular/core';
import Swal from 'sweetalert2';
import { Especialidad } from '../../../interfaces/especialidad';
import { CategoriaInterface } from '../../../interfaces/categoria-interface';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EspecialidadesService } from '../../../services/especialidades-service';
import { CategoriaService } from '../../../services/categoria-service';
import { PrimengModule } from '../../../../primeng/primeng-module';

@Component({
  selector: 'app-especialidads',
  standalone: true,
  templateUrl: './especialidads.html',
  styleUrls: [],
  imports: [PrimengModule, ReactiveFormsModule]
})
export class Especialidads {

  especialidades = signal<Especialidad[]>([]);
  categorias = signal<CategoriaInterface[]>([]);
  loading = signal(true);

  visible = false;
  isEdit = false;

  especialidadSeleccionada: Especialidad | null = null;

  especialidadForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    descripcion: new FormControl(''),
    id_categoria: new FormControl('', Validators.required)
  });

  constructor(
    private especialidadesService: EspecialidadesService,
    private categoriasService: CategoriaService
  ) {}

  ngOnInit() {
    this.loadEspecialidades();
    this.loadCategorias();
  }

  /** ============================
   *  CARGAR LISTA DE ESPECIALIDADES
   *  ============================ */
  loadEspecialidades() {
    this.loading.set(true);

    this.especialidadesService.getAll().subscribe({
      next: (res) => {
        this.especialidades.set(res || []);
        this.loading.set(false);
      },
      error: () => {
        this.especialidades.set([]);
        this.loading.set(false);
      }
    });
  }

  /** ============================
   *  CARGAR CATEGORÍAS
   *  ============================ */
  loadCategorias() {
    this.categoriasService.index().subscribe({
      next: (res) => this.categorias.set(res),
      error: () => this.categorias.set([])
    });
  }

  /** ============================
   *  ABRIR MODAL PARA CREAR
   *  ============================ */
 openCreate() {
  this.isEdit = false;
  this.especialidadSeleccionada = null;

  this.especialidadForm.reset({
    nombre: '',
    descripcion: '',
    id_categoria: ''
  });

  this.visible = true;
}

  /** ============================
   *  ABRIR MODAL PARA EDITAR
   *  ============================ */
  openEdit(esp: Especialidad) {
  this.isEdit = true;
  this.especialidadSeleccionada = esp;

  this.especialidadForm.patchValue({
    nombre: esp.nombre,
    descripcion: esp.descripcion,
    id_categoria: esp.categoria?.id || esp.id_categoria
  });

  this.visible = true;
}

  /** ============================
   *  GUARDAR (CREAR / EDITAR)
   *  ============================ */
  guardarEspecialidad() {
    if (this.especialidadForm.invalid) return;

    const payload: Partial<Especialidad> = {
      nombre: this.especialidadForm.value.nombre!,
      descripcion: this.especialidadForm.value.descripcion!,
      id_categoria: this.especialidadForm.value.id_categoria!
    };

    // EDITAR
    if (this.isEdit && this.especialidadSeleccionada?.id) {
      this.especialidadesService.update(this.especialidadSeleccionada.id, payload).subscribe({
        next: () => {
          Swal.fire('Actualizado', 'La especialidad fue actualizada', 'success');
          this.closeDialog();
          this.loadEspecialidades();
        },
        error: (err) =>
          Swal.fire('Error', err.error?.message || 'Error al actualizar', 'error')
      });

      return;
    }

    // CREAR
    this.especialidadesService.create(payload).subscribe({
      next: () => {
        Swal.fire('Creado', 'La especialidad fue creada', 'success');
        this.closeDialog();
        this.loadEspecialidades();
      },
      error: (err) =>
        Swal.fire('Error', err.error?.message || 'Error al crear', 'error')
    });
  }

  /** ============================
   *  ELIMINAR ESPECIALIDAD
   *  ============================ */
deleteEspecialidad(id: string) {
  Swal.fire({
    title: '¿Inactivar especialidad?',
    text: 'La especialidad quedará inactiva, pero no se eliminará.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Inactivar',
    cancelButtonText: 'Cancelar'
  }).then((res) => {
    if (res.isConfirmed) {

      this.especialidadesService.delete(id).subscribe(() => {

        // Actualizar estado en la tabla sin eliminar el registro
        this.especialidades.update(lista =>
          lista.map(e =>
            e.id === id
              ? { ...e, estado: 'inactivo' }
              : e
          )
        );

        Swal.fire('Inactivado', 'La especialidad fue marcada como inactiva', 'success');
      });
    }
  });
}

  /** ============================
   *  CERRAR MODAL
   *  ============================ */
  closeDialog() {
    this.visible = false;
    this.isEdit = false;
    this.especialidadSeleccionada = null;

    this.especialidadForm.reset({
      nombre: '',
      descripcion: '',
      id_categoria: ''
    });
  }

changeEstado(id: string, nuevoEstado: 'activo' | 'inactivo') {
  const accion = nuevoEstado === 'inactivo' ? 'Inactivar' : 'Reactivar';

  Swal.fire({
    title: `${accion} especialidad?`,
    text: `La especialidad será marcada como ${nuevoEstado}.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: accion,
    cancelButtonText: 'Cancelar'
  }).then((res) => {
    if (res.isConfirmed) {

      this.especialidadesService.update(id, { estado: nuevoEstado }).subscribe(() => {

        // Actualizar en memoria
        this.especialidades.update(lista =>
          lista.map(e =>
            e.id === id
              ? { ...e, estado: nuevoEstado }
              : e
          )
        );

        Swal.fire('Actualizado', `La especialidad ahora está ${nuevoEstado}`, 'success');
      });

    }
  });
}

}