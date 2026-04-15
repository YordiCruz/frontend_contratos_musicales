import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PagosInterface } from '../../../interfaces/pagos-interface';
import { PagosService } from '../../../services/pagos-service';
import { PrimengModule } from "../../../../primeng/primeng-module";
import { ContratoConCalculos, ContratosInterface } from '../../../interfaces/contratos-interface';
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
@Input() contrato?: ContratoConCalculos;
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
// @Input() contrato?: ContratosInterface;

 // 1) FormGroup: agregar control 'descuento'
ngOnInit(): void {
  this.form = this.fb.group({
    contratoId: ['', Validators.required],
    monto: [0, [Validators.required, Validators.min(0)]],
    descuento: [0, [Validators.min(0)]],        // <-- nuevo control
    metodo: ['', Validators.required],
    tipo: ['', Validators.required],
    referencia: [''],
    proveedor: [''],
    transaccion_id: [''],
    payload: [null]
  });

  if (this.pago) {
    this.form.patchValue(this.pago);
  }

  // recalcular monto cuando cambie el tipo
  this.form.get('tipo')?.valueChanges.subscribe(tipo => {
    this.recalcularMonto(tipo);
  });

  // si el usuario modifica el descuento manualmente, actualizar monto si quieres
  this.form.get('descuento')?.valueChanges.subscribe(d => {
    const base = this.montoFinal || 0;
    const desc = Number(d) || 0;
    // ejemplo: aplicar descuento porcentual sobre montoFinal
    const nuevo = +(base * (1 - desc / 100)).toFixed(2);
    // solo parchea si el usuario no está editando monto manualmente
    this.form.patchValue({ monto: nuevo }, { emitEvent: false });
  });
}


  // Reemplaza recalcularMonto() con esta versión mejorada

get montoBase(): number {
  if (!this.contrato) return 0;
  const total = Number(this.contrato.evento?.precio_base) * this.contrato.horas_contratadas;
  const descuento = this.contrato.descuento ?? 0;
  // Si el contrato ya trae monto_total calculado, úsalo; si no, calcúlalo aquí
  return this.contrato.monto_total ?? (total * (1 - descuento / 100));
}



  montoFinal = 0;
  descuento = 0;

 // 2) ngOnChanges: parchear contrato, monto y descuento
ngOnChanges(): void {
  if (this.contrato) {
    // setear id de contrato
    this.form?.patchValue({ contratoId: this.contrato.id_contrato });

    // monto y descuento vienen del contrato (si existen)
    const montoContrato = Number(this.contrato.monto_total ?? 0);
    const descuentoContrato = Number(this.contrato.descuento ?? 0);

    this.montoFinal = montoContrato;
    this.descuento = descuentoContrato;

    // parchear el formulario para que los inputs muestren los valores
    this.form?.patchValue({
      monto: montoContrato,
      descuento: descuentoContrato
    }, { emitEvent: false });
  }
}



recalcularMonto(tipo: string) {
  const base = this.montoFinal; // ← ya viene listo, no recalculas

  const montos: Record<string, number> = {
    adelanto: +(base * 0.30).toFixed(2),
    saldo:    +(base * 0.70).toFixed(2),
    completo: base,
    extra:    0,
  };

  if (tipo in montos) {
    this.form.patchValue({ monto: montos[tipo] }, { emitEvent: false });
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
