import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PagosInterface } from '../../interfaces/pagos-interface';
import { MessageService } from 'primeng/api';
import { PagosService } from '../../services/pagos-service';
import { PrimengModule } from '../../../primeng/primeng-module';
import { ReactiveFormsModule } from '@angular/forms';
import { PagosForm } from './form/pagos-form';
import { ContratosInterface } from '../../interfaces/contratos-interface';

@Component({
  selector: 'app-pagos',
  imports: [PrimengModule, ReactiveFormsModule, PagosForm],
  templateUrl: './pagos.html',
  styleUrl: './pagos.scss',
  providers: [MessageService]
})
export class Pagos implements OnInit {
  pagos: PagosInterface[] = [];
  displayForm = false;
  selectedPago?: PagosInterface;

  constructor(
    public pagosService: PagosService,
    private messageService: MessageService,
     private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarPagos();
  }

  confirmarPago(pagoId: string) {
  this.pagosService.confirmarPago(pagoId).subscribe({
    next: () => this.cargarPagos(),
    error: (err) => {
      console.error('Error al confirmar pago', err);
      // Aquí podrías mostrar un Toast
    }
  });
}

  cargarPagos() {
    // Aquí puedes reemplazar 'contratoId' por un valor dinámico
    this.pagosService.listarPagos('1234').subscribe({
      next: (res) => {this.pagos = res,
      this.cd.detectChanges()
    },
      error: () => this.messageService.add({severity:'error', summary:'Error', detail:'No se pudieron cargar los pagos'})
    });
  }

  abrirFormulario(pago?: PagosInterface) {
    this.selectedPago = pago;
    this.displayForm = true;
  }

  selectedContrato?: ContratosInterface;

  abrirFormularioDesdeContrato(contrato: ContratosInterface) {
  this.selectedPago = undefined;
  this.displayForm = true;
  this.selectedContrato = contrato; // 🔑 pasas el contrato al hijo
}


  pagoGuardado(event: PagosInterface) {
    this.displayForm = false;
    this.messageService.add({severity:'success', summary:'Exito', detail:'Pago registrado correctamente'});
    this.cargarPagos();
  }
}
