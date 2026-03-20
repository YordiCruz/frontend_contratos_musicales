import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoriaService } from '../../../services/categoria-service';
import Swal from 'sweetalert2';
import { PrimengModule } from '../../../../primeng/primeng-module';
import { CategoriaInterface } from '../../../interfaces/categoria-interface';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [PrimengModule, ReactiveFormsModule],
  templateUrl: './categoria.html',
  styleUrls: []
})
export class Categoria {

  categorias = signal<CategoriaInterface[]>([]);
  loading = signal(true);

  visible = false;
  isEdit = false;

  categoriaSeleccionada: CategoriaInterface | null = null;

  categoriaForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    descripcion: new FormControl('')
  });

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit() {
    this.loadCategorias();
  }

  /** ============================
   *  CARGAR LISTA DE CATEGORÍAS
   *  ============================ */
  loadCategorias() {
    this.loading.set(true);

    this.categoriaService.index().subscribe({
      next: (data) => {
        this.categorias.set(data || []);
        this.loading.set(false);
      },
      error: () => {
        this.categorias.set([]);
        this.loading.set(false);
      }
    });
  }

  /** ============================
   *  ABRIR MODAL PARA CREAR
   *  ============================ */
  openCreate() {
    this.isEdit = false;
    this.categoriaSeleccionada = null;
    this.categoriaForm.reset({ nombre: '', descripcion: '' });
    this.visible = true;
  }

  /** ============================
   *  ABRIR MODAL PARA EDITAR
   *  ============================ */
  openEdit(cat: CategoriaInterface) {
    this.isEdit = true;
    this.categoriaSeleccionada = cat;

    this.categoriaForm.patchValue({
      nombre: cat.nombre,
      descripcion: cat.descripcion
    });

    this.visible = true;
  }

  /** ============================
   *  GUARDAR (CREAR / EDITAR)
   *  ============================ */
  guardarCategoria() {
    if (this.categoriaForm.invalid) return;

    const payload: CategoriaInterface = {
      nombre: this.categoriaForm.value.nombre!,
      descripcion: this.categoriaForm.value.descripcion!
    };

    // EDITAR
    if (this.isEdit && this.categoriaSeleccionada?.id) {
      this.categoriaService.update(this.categoriaSeleccionada.id, payload).subscribe({
        next: () => {
          Swal.fire('Actualizado', 'La categoría fue actualizada', 'success');
          this.closeDialog();
          this.loadCategorias();
        },
        error: (err) =>
          Swal.fire('Error', err.error?.message || 'Error al actualizar', 'error')
      });

      return;
    }

    // CREAR
    this.categoriaService.store(payload).subscribe({
      next: () => {
        Swal.fire('Creado', 'La categoría fue creada', 'success');
        this.closeDialog();
        this.loadCategorias();
      },
      error: (err) =>
        Swal.fire('Error', err.error?.message || 'Error al crear', 'error')
    });
  }

  /** ============================
   *  ELIMINAR CATEGORÍA
   *  ============================ */
  deleteCategoria(id: number) {
    Swal.fire({
      title: '¿Eliminar categoría?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((res) => {
      if (res.isConfirmed) {
        this.categoriaService.destroy(id).subscribe(() => {
          this.categorias.set(this.categorias().filter(c => c.id !== id));
          Swal.fire('Eliminado', 'La categoría fue eliminada', 'success');
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
    this.categoriaSeleccionada = null;
    this.categoriaForm.reset({ nombre: '', descripcion: '' });
  }
}