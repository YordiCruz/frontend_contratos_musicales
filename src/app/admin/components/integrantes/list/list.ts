import { Component, effect, inject, signal } from '@angular/core';
import { PrimengModule } from '../../../../primeng/primeng-module';
import { IntegranteService } from '../../../services/integrante-service';
import { IntegranteInterface } from '../../../interfaces/integrante-interface';
import { IntegrantesForm } from '../form/form';

@Component({
  selector: 'app-list',
  imports: [PrimengModule, IntegrantesForm ],
  templateUrl: './list.html',
  styleUrl: './list.scss'
})
export class List {

    integranteService = inject(IntegranteService);

  integrantes = signal<IntegranteInterface[]>([]);
  
  selectedIntegrante: IntegranteInterface | null = null;
  dialogVisible = false;

  constructor() {
    this.cargarIntegrantes();
  }

  cargarIntegrants() {
    effect(() => {
  this.integranteService.listar().subscribe((res) => {
    this.integrantes.set(res);
  });
});

  }

  cargarIntegrantes() {
  this.integranteService.listar().subscribe((res: any) => {
    this.integrantes.set(res);
  
  });
}

  editar(integ: IntegranteInterface) {
    this.selectedIntegrante = integ;
    this.dialogVisible = true;
  }

  cerrarDialog() {
    this.dialogVisible = false;
    this.selectedIntegrante = null;
  }

  onGuardado() {
    this.cargarIntegrantes();
    this.cerrarDialog();
  }

}

