import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PagosInterface } from '../../../interfaces/pagos-interface';
import { PagosService } from '../../../services/pagos-service';
import { PrimengModule } from "../../../../primeng/primeng-module";
import { ContratosInterface } from '../../../interfaces/contratos-interface';
import { QRCodeComponent } from 'angularx-qrcode'

@Component({
  selector: 'app-pagos-form',
  templateUrl: './pagos-form.html',
  standalone: true,
  imports: [PrimengModule, ReactiveFormsModule, QRCodeComponent],
  providers: [MessageService]
})
export class PagosForm implements OnInit {

    stringify = JSON.stringify;


     @Input() displayForm = false;
  @Input() pago?: PagosInterface;
  @Output() guardar = new EventEmitter<PagosInterface>();
  @Output() cancelar = new EventEmitter<void>();

  form!: FormGroup;

  metodos = [
    { label: 'Efectivo', value: 'efectivo' },
    { label: 'QR', value: 'qr' },
    { label: 'Transferencia', value: 'transferencia' },
    { label: 'Online', value: 'online' }
  ];

  tipos = [
    { label: 'Adelanto', value: 'adelanto' },
    { label: 'Saldo', value: 'saldo' },
    { label: 'Extra', value: 'extra' }
  ];

  constructor(
    private fb: FormBuilder,
    private pagosService: PagosService,
    private messageService: MessageService
  ) {}

  // Simulación: recibes el contrato desde el padre
@Input() contrato?: ContratosInterface;

  ngOnInit(): void {
    this.form = this.fb.group({
      contratoId: ['', Validators.required],
      monto: [0, [Validators.required, Validators.min(0)]],
      metodo: ['', Validators.required],
      tipo: ['', Validators.required],
      referencia: [''],
      proveedor: [''],        // 👈 opcional
      transaccion_id: [''],   // 👈 opcional
      payload: [null]         // 👈 opcional
    });

    if (this.pago) {
      this.form.patchValue(this.pago);
    }


     // 🔥 recalcular monto cuando cambie el tipo
  this.form.get('tipo')?.valueChanges.subscribe(tipo => {
    this.recalcularMonto(tipo);
  });

  }


  recalcularMonto(tipo: string) {
  if (!this.contrato) return;

  const total = Number(this.contrato.evento?.precio_base) * this.contrato.horas_contratadas;

  if (tipo === 'adelanto') {
    const porcentaje = 0.3;
    this.form.patchValue({ monto: total * porcentaje }, { emitEvent: false });
  } else if (tipo === 'saldo') {
    const porcentaje = 0.3;
    this.form.patchValue({ monto: total - (total * porcentaje) }, { emitEvent: false });
  } else if (tipo === 'completo') {
    this.form.patchValue({ monto: total }, { emitEvent: false });
  }
}
 


cargarDesdeQR(payload: any) {
  this.form.patchValue({
    contratoId: payload.contratoId,
    referencia: payload.referencia,
    metodo: 'qr',
    tipo: payload.tipo || 'adelanto'
  });

  this.recalcularMonto(payload.tipo || 'adelanto');
  this.displayForm = true;
}

ngOnChanges(): void {
  if (this.contrato) {
    this.form?.patchValue({ contratoId: this.contrato.id_contrato });
  }
}




  onSubmit() {
    if (this.form.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Completa todos los campos obligatorios'
      });
      return;
    }

    this.pagosService.registrarPago(this.form.value).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Pago registrado correctamente'
        });
        this.guardar.emit(res);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo registrar el pago'
        });
      }
    });
  }
}
