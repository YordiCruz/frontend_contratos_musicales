import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { IntegranteInterface } from '../../../interfaces/integrante-interface';
import { IntegranteService } from '../../../services/integrante-service';
import { PrimengModule } from '../../../../primeng/primeng-module';

@Component({
  selector: 'app-integrantes-form',
  imports: [PrimengModule, ReactiveFormsModule, FormsModule],
  templateUrl: './form.html',
  styleUrl: './form.scss'
})
export class IntegrantesForm {
  integranteService = inject(IntegranteService);
  fb = inject(FormBuilder);

  @Input() integrante: IntegranteInterface | null = null;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  visible = true;

  form = this.fb.group({
    especialidad: ['', Validators.required],
    tarifa_base_hora: ['', Validators.required],
    experiencia: ['', Validators.required],
    descripcion: [''],
    fecha_ingreso: [new Date(), Validators.required]
  });

  ngOnInit() {
    if (this.integrante) {
      this.form.patchValue({
        especialidad: this.integrante.especialidad,
        tarifa_base_hora: this.integrante.tarifa_base_hora,
        experiencia: this.integrante.experiencia,
        descripcion: this.integrante.descripcion
      });
    }
  }

  guardar() {
    if (this.form.invalid) return;

    const data = {
      ...this.form.value,
      fecha_ingreso: new Date(this.form.value.fecha_ingreso!).toISOString(),
      id_usuario: this.integrante?.id_usuario || null
    };

    const request$ = this.integrante
      ? this.integranteService.editar(this.integrante.id, data)
      : this.integranteService.crear(data);

    request$.subscribe({
      next: () => {
        Swal.fire('Éxito', 'Integrante guardado correctamente', 'success');
        this.guardado.emit();
      },
      error: () => {
        Swal.fire('Error', 'No se pudo guardar el integrante', 'error');
      }
    });
  }
}
