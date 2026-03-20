import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { IntegranteService } from '../../services/integrante-service';
import { IntegranteInterface } from '../../interfaces/integrante-interface';
import { PrimengModule } from '../../../primeng/primeng-module';
import { Especialidad } from '../../interfaces/especialidad';

@Component({
  selector: 'app-integrantes',
  standalone: true,
  imports: [PrimengModule, ReactiveFormsModule, FormsModule],
  templateUrl: './integrantes.html',
})
export class Integrantes implements OnInit {

  integranteService = inject(IntegranteService);

  visible = false;
  visibleeditar = false;

  integrantes = signal<IntegranteInterface[]>([]);
  especialidades = signal<Especialidad[]>([]);

  integrante_id: string | null = null;

  today: Date = new Date();

  // FORMULARIO CREAR
  formCrear = new FormGroup({
    persona: new FormGroup({
      nombre: new FormControl('', Validators.required),
      apellido: new FormControl('', Validators.required),
      documento_identidad: new FormControl('', [
  Validators.required,
  Validators.pattern(/^\d{8}$/)
]),

telefono: new FormControl('', [
  Validators.required,
  Validators.pattern(/^\d{8}$/)
]),
      email: new FormControl('', [Validators.required, Validators.email])
    }),

    id_especialidades: new FormControl<string[]>([], Validators.required),
    tarifa_base_hora: new FormControl<number | null>(null, Validators.required),
    moneda: new FormControl('BOB', Validators.required),
    descripcion: new FormControl(''),
    fecha_ingreso: new FormControl('', Validators.required)
  });

  // FORMULARIO EDITAR
  formEditar = new FormGroup({
  id_especialidades: new FormControl<string[]>([], Validators.required),
  tarifa_base_hora: new FormControl<number | null>(null, Validators.required),
  moneda: new FormControl('BOB', Validators.required),
  descripcion: new FormControl('')
});

  ngOnInit(): void {
    this.cargarEspecialidades();
    this.cargarIntegrantes();
  }

  cargarIntegrantes() {
    this.integranteService.listar().subscribe((res) => {
      console.log('DATA:', res); 
      this.integrantes.set(res);
    });
  }

  cargarEspecialidades() {
    this.integranteService.listarEspecialidades().subscribe((res) => {
      this.especialidades.set(res);
    });
  }

  // CREAR
  showDialogCrear() {
    this.visible = true;
    this.integrante_id = null;

    this.formCrear.reset({
      persona: {
        nombre: '',
        apellido: '',
        documento_identidad: '',
        telefono: '',
        email: ''
      },
      id_especialidades: [],
      tarifa_base_hora: null, 
      descripcion: '',
      fecha_ingreso: ''
    });
  }

guardarCrear() {
  if (this.formCrear.invalid) return;

  const form = this.formCrear.value;

  const payload = {
    persona: form.persona,
    integrante: {
      tarifa_base_hora: Number(form.tarifa_base_hora),
      moneda: 'BOB', // o lo que corresponda
      fecha_ingreso: new Date(form.fecha_ingreso!).toISOString(),
      estado: 'activo'
    }
  };

  this.integranteService.crear(payload).subscribe((nuevo) => {

    const dto = {
      especialidades: form.id_especialidades!.map(id => ({
        id_especialidad: id,
        tipo: 'secundario'
      }))
    };

    if (dto.especialidades.length > 0) {
      dto.especialidades[0].tipo = 'primario';
    }

    this.integranteService.asignarMultiples(nuevo.id, dto).subscribe(() => {
      Swal.fire('Éxito', 'Integrante creado con especialidades', 'success');
      this.visible = false;
      this.cargarIntegrantes();
    });

  });
}




  // EDITAR
showDialogEditar(integ: IntegranteInterface) {
  this.integrante_id = integ.id;

  this.formEditar.patchValue({
    id_especialidades: integ.especialidades.map(e => e.id), // 👈 IDs de especialidad
    tarifa_base_hora: Number(integ.tarifa_base_hora),
    moneda: integ.moneda,
  });

  this.visibleeditar = true;
}



guardarEditar() {
  if (!this.integrante_id || this.formEditar.invalid) return;

  const payload = this.formEditar.value;

  // 1. Editar datos del integrante
  this.integranteService.editar(this.integrante_id, payload!).subscribe(() => {

    // 2. Preparar DTO para asignar múltiples especialidades
    const dto = {
      especialidades: this.formEditar.value.id_especialidades!.map(id => ({
        id_especialidad: id,
        tipo: 'secundario'
      }))
    };

    // La primera será primaria
    if (dto.especialidades.length > 0) {
      dto.especialidades[0].tipo = 'primario';
    }

    // 3. Enviar al backend
    this.integranteService.asignarMultiples(this.integrante_id!, dto).subscribe(() => {
      Swal.fire('Éxito', 'Integrante actualizado con especialidades', 'success');
      this.visibleeditar = false;
      this.integrante_id = null;
      this.cargarIntegrantes();
    });

  });
}


  eliminar(integ: IntegranteInterface) {
    Swal.fire({
      title: '¿Inactivar integrante?',
      text: `Se marcará como inactivo a ${integ.persona?.nombre} ${integ.persona?.apellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, inactivar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.integranteService.editar(integ.id, { estado: 'inactivo' }).subscribe(() => {
          this.cargarIntegrantes();
          Swal.fire('Integrante inactivado!', '', 'success');
        });
      }
    });
  }

  // ORDENAMIENTO
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

  first = 0;
  rows = 10;

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }


  reactivar(integ: IntegranteInterface) {
  Swal.fire({
    title: '¿Reactivar integrante?',
    text: `Se reactivará a ${integ.persona?.nombre} ${integ.persona?.apellido}`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, reactivar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.integranteService.editar(integ.id, { estado: 'activo' }).subscribe(() => {
        this.cargarIntegrantes();
        Swal.fire('Integrante reactivado!', '', 'success');
      });
    }
  });
}



}