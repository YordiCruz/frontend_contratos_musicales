import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from '../../../../../primeng/primeng-module';
import { CategoriaEventosInterface } from '../../../../interfaces/categoria-eventos-interface';
import { EventosInterface } from '../../../../interfaces/eventos-interface';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-eventos-form',
  standalone: true,
  templateUrl: './eventos-form.html',
  imports: [PrimengModule, ReactiveFormsModule],
})
export class EventosForm {
    constructor( private messageService: MessageService) {}
  @Input() categorias: CategoriaEventosInterface[] = [];
  @Input() evento: EventosInterface | null = null;
  @Input() modo: 'create' | 'edit' = 'create';

  @Output() guardar = new EventEmitter<any>();
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


onGuardar() {
  if (this.formEvento.invalid) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Formulario incompleto',
      detail: 'Por favor complete todos los campos obligatorios'
    });
    return;
  }

  const payload = this.formEvento.value;
  this.guardar.emit(payload); // solo emite al padre
}



  onCerrar() {
    this.cerrar.emit();
  }
}
