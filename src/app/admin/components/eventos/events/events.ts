// src/app/admin/pages/eventos/eventos.ts
import { Component, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { PrimengModule } from '../../../../primeng/primeng-module';

import { EventosInterface } from '../../../interfaces/eventos-interface';
import { CategoriaEventosInterface } from '../../../interfaces/categoria-eventos-interface';
import { MediaEventosInterface } from '../../../interfaces/media-eventos-interface';

import { EventosService } from '../../../services/eventos-service';
import { CategoriaEventosService } from '../../../services/categoria-eventos-service';
import { MediaEventosService } from '../../../services/media-eventos-service';
import { EventosForm } from './form/eventos-form';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-events',
  standalone: true,
  templateUrl: './events.html',
  imports: [CommonModule, PrimengModule, ReactiveFormsModule, EventosForm],
  providers: [MessageService]
})
export class Events {

  eventos = signal<EventosInterface[]>([]);
  categorias = signal<CategoriaEventosInterface[]>([]);

  mediaVisible = false;

  visible = false;
  modo: 'create' | 'edit' = 'create';

  rows = 10;
  first = 0;

  eventoSeleccionado: EventosInterface | null = null;

  formEvento = new FormGroup({
    id_categoria: new FormControl<string | null>(null, [Validators.required]),
    nombre: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    descripcion: new FormControl<string | null>(null),
    precio_base: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    
  });

  // PASOS
  step = 1;
  id_evento_creado: string | null = null;

  // MEDIA
  media = signal<MediaEventosInterface[]>([]);

  constructor(
    private eventosService: EventosService,
    private categoriaService: CategoriaEventosService,
    private mediaService: MediaEventosService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadEventos();
    this.loadCategorias();
  }

   fixUrl(url: string): string {
  if (!url) return 'assets/no-image.png';
  if (url.startsWith('http')) return url;
  return `http://localhost:3070${url.startsWith('/') ? '' : '/'}${url}`;
}

 loadEventos() {
  this.eventosService.listar().subscribe((res: any[]) => {
    const eventosNormalizados = res.map(ev => ({
      ...ev,
      precio_base: ev.precio_base != null ? Number(ev.precio_base) : null, // 👈 fix
      media: ev.media?.map((m: MediaEventosInterface) => ({
        ...m,
        url: m.url?.startsWith('http') ? m.url : this.fixUrl(m.url)
      }))
    }));
    this.eventos.set(eventosNormalizados);
  });
}


getFirstImage(ev: EventosInterface): string {
  return ev.media?.length ? this.fixUrl(ev.media[0].url) : 'assets/no-image.png';
}


compareCategories(option: any, value: any) {
  return String(option) === String(value);
}


loadCategorias() {
  this.categoriaService.listar().subscribe(res => {
    const categoriasNormalized = (res || []).map(c => ({
      ...c,
      id_categoria: String(c.id_categoria) // 🔑 convertir a string
    }));
    this.categorias.set(categoriasNormalized);
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

  // ============================
  // CREAR EVENTO
  // ============================
 openCreate() {
    this.modo = 'create';
    this.eventoSeleccionado = null;
    this.visible = true;
    this.id_evento_creado = null;
  }

  // ============================
  // EDITAR EVENTO
  // ============================
  
// Al abrir modal de edición o creación de evento
  openEdit(e: EventosInterface) {
    this.modo = 'edit';
    this.eventoSeleccionado = e;
    this.visible = true;
  }


/// media 

openMediaModal(e: EventosInterface) {
  this.id_evento_creado = e.id_evento;
  this.eventoSeleccionado = e;

  this.loadMedia();
  this.mediaVisible = true; // modal de media
}

guardarMedia() {
  this.mediaVisible = false;

  // Refrescar la tabla principal
  this.loadEventos();

  Swal.fire({
  title: 'Media actualizada',
  text: 'Las imágenes y videos fueron guardados correctamente',
  icon: 'success',
  customClass: {
    popup: 'rounded-xl shadow-2xl p-6',
    title: 'text-2xl font-bold text-gray-800',
    htmlContainer: 'text-gray-600 text-lg',
    confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg',
    cancelButton: 'bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg'
  },
  buttonsStyling: false
});
}

getUrl(media: MediaEventosInterface) {
  return media.url.startsWith('http') ? media.url : this.fixUrl(media.url);
}


  // ============================
  // PASO 1: GUARDAR EVENTO
  // ============================

onGuardarEvento(payload: any) {
  if (this.modo === 'create') {
    this.eventosService.crear(payload).subscribe({
      next: ev => {
        this.id_evento_creado = ev.id_evento;
        this.loadEventos();
        this.visible = false;

        // ✅ Swal para éxito + pregunta de media
        Swal.fire({
          title: 'Evento creado',
          text: '¿Desea agregar imágenes o videos al evento?',
          icon: 'success',
          showCancelButton: true,
          confirmButtonText: 'Sí, agregar media',
          cancelButtonText: 'No, gracias'
        }).then(res => {
          if (res.isConfirmed) {
            this.mediaVisible = true;
            this.loadMedia();
          }
        });
      },
      error: err => {
        // ❌ MessageService para error
        this.messageService.add({
          severity: 'error',
          summary: 'Error al crear',
          detail: err?.error?.message || 'Error desconocido'
        });
      }
    });
  } else if (this.modo === 'edit' && this.eventoSeleccionado) {
    this.eventosService.editar(this.eventoSeleccionado.id_evento, payload).subscribe({
      next: () => {
        this.loadEventos();
        this.visible = false;

        // ✅ Swal para éxito
        Swal.fire('Evento actualizado', 'Los cambios fueron guardados correctamente', 'success');
      },
      error: err => {
        // ❌ MessageService para error
        this.messageService.add({
          severity: 'error',
          summary: 'Error al actualizar',
          detail: err?.error?.message || 'Error desconocido'
        });
      }
    });
  }
}



  onCerrarEvento() {
    this.visible = false;
    this.eventoSeleccionado = null;
    this.id_evento_creado = null;
  }


//   guardarPaso1() {
//     if (this.formEvento.invalid) return;

//     const f = this.formEvento.value;

//     const payload = {
//       id_categoria: f.id_categoria!,
//       nombre: f.nombre!,
//       descripcion: f.descripcion ?? null,
//       precio_base: f.precio_base != null ? Number(f.precio_base) : 0
//     };

//     if (this.modo === 'create') {
//   this.eventosService.crear(payload).subscribe(ev => {
//     this.id_evento_creado = ev.id_evento;
//     this.loadEventos();

//     this.visible = false; // cerrar modal de datos

//     Swal.fire({
//       title: 'Evento creado',
//       text: '¿Desea agregar imágenes o videos al evento?',
//       icon: 'success',
//       showCancelButton: true,
//       confirmButtonText: 'Sí, agregar media',
//       cancelButtonText: 'No, gracias'
//     }).then(res => {
//       if (res.isConfirmed) {
//         this.mediaVisible = true; // abrir modal de media
//         this.loadMedia();
//       }
//     });
//   });
// } else if (this.modo === 'edit' && this.eventoSeleccionado) {
//   this.eventosService.editar(this.eventoSeleccionado.id_evento, payload).subscribe(() => {
//     Swal.fire('Actualizado', 'Datos del evento actualizados', 'success');

//     this.visible = false;

//     this.loadMedia();
//     this.loadEventos();
//   });

//     }
//   }

  // ============================
  // MEDIA
  // ============================


  loadMedia() {
  if (!this.id_evento_creado) return;

  this.mediaService.listar(this.id_evento_creado).subscribe(res => {
    const mediaConUrl = (res || []).map(m => ({
      ...m,
      url: m.url?.startsWith('http') ? m.url : this.fixUrl(m.url)
    }));
    this.media.set(mediaConUrl);
  });
}

  onMediaUpload(event: any) {
  console.log('UPLOAD', event);

  const files: File[] = Array.from(event.files); // 👈 CLAVE

  if (!this.id_evento_creado) {
    console.warn('NO HAY ID EVENTO');
    return;
  }

 this.mediaService.subirGaleria(this.id_evento_creado, files)
  .subscribe(() => {
    this.loadMedia();
    this.loadEventos(); // actualiza tabla principal

    Swal.fire('Listo', 'Las imágenes/videos fueron subidos correctamente', 'success');
  });
}

toggleVisibilidad(m: MediaEventosInterface) {
  this.mediaService.cambiarVisibilidad(m.id_media, !m.visibilidad_publica)
    .subscribe(() => {
      this.loadMedia();
      this.loadEventos();

    });
}


eliminar(m: MediaEventosInterface) {
  this.mediaService.eliminar(m.id_media).subscribe({
    next: () => {
      this.loadMedia();
      this.loadEventos();

      // ✅ Toast de confirmación
      this.messageService.add({
        severity: 'success',
        summary: 'Imagen eliminada',
        detail: 'La imagen fue eliminada correctamente'
      });
    },
    error: err => {
      // ❌ Toast de error
      this.messageService.add({
        severity: 'error',
        summary: 'Error al eliminar',
        detail: err?.error?.message || 'No se pudo eliminar la imagen'
      });
    }
  });
}

  // ============================
  // FINALIZAR
  // ============================
 finalizar() {
  this.visible = false;

  if (this.modo === 'create') {
    this.step = 1;
    this.id_evento_creado = null;
    this.formEvento.reset();
  }
}
  // ============================
  // CAMBIAR ESTADO
  // ============================
  changeEstado(e: EventosInterface, estado: 'activo' | 'inactivo' | 'planificado' | 'cancelado') {
    Swal.fire({
      title: `¿Cambiar estado a "${estado}"?`,
      text: e.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar'
    }).then(res => {
      if (res.isConfirmed) {
        this.eventosService.changeEstado(e.id_evento, estado).subscribe(() => {
          this.loadEventos();
          Swal.fire('Actualizado', `Evento ahora está ${estado}`, 'success');
        });
      }
    });
  }

  // ============================
  // CERRAR MODAL
  // ============================
  closeDialog() {
    this.visible = false;
    this.eventoSeleccionado = null;
    this.step = 1;
    this.id_evento_creado = null;
    this.media.set([]);
  }

  // ============================
  // TAG SEVERITY
  // ============================
  getSeverity(estado: string) {
    switch (estado) {
      case 'activo': return 'success';
      case 'inactivo': return 'danger';
      case 'planificado': return 'info';
      case 'cancelado': return 'warn';
      default: return 'secondary';
    }
  }


  // Variables en tu componente
imageModalVisible = false;
imageModalUrl: string | null = null;

// Función para abrir imagen
openImage(url: string) {
  this.imageModalUrl = this.fixUrl(url);
  this.imageModalVisible = true;
}


// Función opcional para cerrar (PrimeNG dialog lo hace automáticamente con [(visible)])
closeImageModal() {
  this.imageModalVisible = false;
  this.imageModalUrl = null;
}



}