import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from '../../../../../primeng/primeng-module';
import { CategoriaEventosInterface } from '../../../../interfaces/categoria-eventos-interface';
import { EventosInterface } from '../../../../interfaces/eventos-interface';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';
import { EventosService } from '../../../../services/eventos-service';

@Component({
  selector: 'app-eventos-form',
  standalone: true,
  templateUrl: './eventos-form.html',
  imports: [PrimengModule, ReactiveFormsModule],
  providers: [MessageService]
})
export class EventosForm {
  constructor(
    private eventosService: EventosService,
    private messageService: MessageService
  ) {}

  @Input() categorias: CategoriaEventosInterface[] = [];
  @Input() evento: EventosInterface | null = null;
  @Input() modo: 'create' | 'edit' = 'create';
  @Input() usarSwal = true;

  @Output() eventoRegistrado = new EventEmitter<EventosInterface>();
  @Output() abrirMedia = new EventEmitter<EventosInterface>(); // 👈 nuevo output para abrir media
  @Output() cerrar = new EventEmitter<void>();

  formEvento = new FormGroup({
    id_categoria: new FormControl<string | null>(null, [Validators.required]),
    nombre: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    descripcion: new FormControl<string | null>(null),
    precio_base: new FormControl<number | null>(null, [Validators.required, Validators.min(0)])
  });

  ngOnChanges() {
    if (this.evento) {
      this.formEvento.patchValue({
        id_categoria: String(this.evento.id_categoria),
        nombre: this.evento.nombre,
        descripcion: this.evento.descripcion ?? null,
        precio_base: this.evento.precio_base ?? null
      });
    } else if (this.modo === 'create') {
      this.formEvento.reset({
        id_categoria: null,
        nombre: '',
        descripcion: null,
        precio_base: null
      });
    }
  }


  visible = true
  id_evento_creado: number | null = null

   onCerrar() {
    this.closeDialog();
    this.visible = false;
    this.id_evento_creado = null;
  }


  guardar() {
    if (this.formEvento.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario incompleto',
        detail: 'Por favor complete todos los campos obligatorios'
      });
      return;
    }

    const f = this.formEvento.value;

const payload = {
  id_categoria: f.id_categoria ?? '', // 👈 asegura string
  nombre: f.nombre ?? '',
  descripcion: f.descripcion ?? null,
  precio_base: f.precio_base != null ? Number(f.precio_base) : 0 // 👈 asegura number
};
    if (this.modo === 'edit' && this.evento) {
      // 🔹 MODO EDICIÓN
      this.eventosService.editar(this.evento.id_evento, payload).subscribe({
        next: (res: EventosInterface) => {
            this.closeDialog();

          Swal.fire('Actualizado', 'Evento actualizado correctamente', 'success');
          this.eventoRegistrado.emit(res);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err?.error?.message || 'Error desconocido'
          });
        }
      });
    } else {
      // 🔹 MODO CREACIÓN
      this.eventosService.crear(payload).subscribe({
        next: (eventoCreado: EventosInterface) => {
          if (this.usarSwal) {
            this.resetForm(); 
            this.closeDialog();
            Swal.fire({
              title: 'Evento creado',
              text: '¿Desea agregar imágenes o videos al evento?',
              icon: 'success',
              showCancelButton: true,
              confirmButtonText: 'Sí, agregar media',
              cancelButtonText: 'No, gracias'
            }).then(res => {
              if (res.isConfirmed) {
                // 👇 notifica al padre que debe abrir el modal de media
                this.abrirMedia.emit(eventoCreado);
              } else {
                this.eventoRegistrado.emit(eventoCreado);
              }
            });
          } else {
            this.messageService.add({
              severity: 'success',
              summary: 'Evento creado',
              detail: 'El evento fue registrado correctamente'
            });
            this.eventoRegistrado.emit(eventoCreado);
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err?.error?.message || 'Error desconocido'
          });
        }
      });
    }
  }

  closeDialog() {
    this.resetForm();
    this.cerrar.emit();
  }

  resetForm() {
  this.formEvento.reset({
    id_categoria: null,
    nombre: '',
    descripcion: null,
    precio_base: null
  });
}


}
