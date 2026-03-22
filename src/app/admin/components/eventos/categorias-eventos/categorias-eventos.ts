import { Component, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { PrimengModule } from '../../../../primeng/primeng-module';
import { CategoriaEventosInterface } from '../../../interfaces/categoria-eventos-interface';
import { CategoriaEventosService } from '../../../services/categoria-eventos-service';

@Component({
  selector: 'app-categorias-eventos',
  standalone: true,
  templateUrl: './categorias-eventos.html',
  imports: [PrimengModule, ReactiveFormsModule]
})
export class CategoriasEventos {

  categorias = signal<CategoriaEventosInterface[]>([]);
  visible = false;
  modo: 'create' | 'edit' = 'create';

  rows = 10;
  first = 0;

  categoriaSeleccionada: CategoriaEventosInterface | null = null;

  formCategoria = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    descripcion: new FormControl<string | null>(null),
  });

  constructor(private categoriaService: CategoriaEventosService) {}

  ngOnInit() {
    this.loadCategorias();
  }

  loadCategorias() {
    this.categoriaService.listar().subscribe(res => {
      this.categorias.set(res || []);
    });
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  customSort(event: any) {
    event.data.sort((a: any, b: any) => {
      const resolve = (obj: any, path: string) =>
        path.split('.').reduce((acc, key) => acc?.[key], obj);

      let v1 = resolve(a, event.field);
      let v2 = resolve(b, event.field);

      if (typeof v1 === 'string') v1 = v1.toLowerCase();
      if (typeof v2 === 'string') v2 = v2.toLowerCase();

      return event.order * ((v1 < v2) ? -1 : (v1 > v2) ? 1 : 0);
    });
  }

  openCreate() {
    this.modo = 'create';
    this.categoriaSeleccionada = null;

    this.formCategoria.reset({
      nombre: '',
      descripcion: null
    });

    this.visible = true;
  }

  openEdit(c: CategoriaEventosInterface) {
    this.modo = 'edit';
    this.categoriaSeleccionada = c;

    this.formCategoria.patchValue({
      nombre: c.nombre,
      descripcion: c.descripcion ?? null
    });

    this.visible = true;
  }

  guardar() {
    if (this.formCategoria.invalid) return;

    const f = this.formCategoria.value;

    const payload = {
      nombre: f.nombre!,
      descripcion: f.descripcion ?? null
    };

    if (this.modo === 'create') {
      this.categoriaService.crear(payload).subscribe(() => {
        Swal.fire('Creado', 'Categoría creada correctamente', 'success');
        this.visible = false;
        this.loadCategorias();
      });

    } else if (this.modo === 'edit' && this.categoriaSeleccionada) {
      this.categoriaService.editar(this.categoriaSeleccionada.id_categoria, payload).subscribe(() => {
        Swal.fire('Actualizado', 'Categoría actualizada correctamente', 'success');
        this.visible = false;
        this.loadCategorias();
      });
    }
  }

  changeEstado(c: CategoriaEventosInterface, estado: 'activo' | 'inactivo') {
    Swal.fire({
      title: `¿${estado === 'inactivo' ? 'Inactivar' : 'Reactivar'} categoría?`,
      text: c.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: estado === 'inactivo' ? 'Inactivar' : 'Reactivar'
    }).then(res => {
      if (res.isConfirmed) {
        this.categoriaService.changeEstado(c.id_categoria, estado).subscribe(() => {
          this.loadCategorias();
          Swal.fire('Actualizado', `Categoría ahora está ${estado}`, 'success');
        });
      }
    });
  }

  closeDialog() {
    this.visible = false;
    this.categoriaSeleccionada = null;
  }
}