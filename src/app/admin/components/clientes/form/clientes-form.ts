import { Component, EventEmitter, Input, Output } from "@angular/core";
import { PrimengModule } from "../../../../primeng/primeng-module";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ClientInterface } from "../../../interfaces/cliente-interface";
import { ClientService } from "../../../services/cliente-service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  templateUrl: './clientes-form.html',
  imports: [PrimengModule, ReactiveFormsModule]
})
export class ClientesForm {
  @Input() cliente: ClientInterface | null = null; // para modo edición
  @Output() clienteRegistrado = new EventEmitter<ClientInterface>();
  @Output() cerrar = new EventEmitter<void>(); // para notificar al padre que se cierre el diálogo

  // opciones de contacto
  preferenciasContacto = [
    { label: 'WhatsApp', value: 'whatsapp' },
    { label: 'Email', value: 'email' },
    { label: 'Teléfono', value: 'telefono' }
  ];

  formCliente = new FormGroup({
    persona: new FormGroup({
      nombre: new FormControl('', Validators.required),
      apellido: new FormControl('', Validators.required),
      documento_identidad: new FormControl('', Validators.required),
      telefono: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email])
    }),
    cliente: new FormGroup({
      preferencia_contacto: new FormControl<string | null>(null),
      tipo_cliente: new FormControl('individual')
    })
  });

  constructor(private clientService: ClientService) {}

  ngOnChanges() {
    // si recibimos un cliente por @Input, rellenamos el formulario (modo edición)
    if (this.cliente) {
      this.formCliente.patchValue({
        persona: {
          nombre: this.cliente.persona.nombre,
          apellido: this.cliente.persona.apellido,
          documento_identidad: this.cliente.persona.documento_identidad,
          telefono: this.cliente.persona.telefono,
          email: this.cliente.persona.email
        },
        cliente: {
          preferencia_contacto: this.cliente.preferencia_contacto,
          tipo_cliente: this.cliente.tipo_cliente
        }
      });
    }
  }

  guardar() {
    if (this.formCliente.invalid) return;

    const f = this.formCliente.value;
    const payload = {
      persona: {
        nombre: f.persona?.nombre!,
        apellido: f.persona?.apellido!,
        documento_identidad: f.persona?.documento_identidad!,
        telefono: f.persona?.telefono!,
        email: f.persona?.email!
      },
      cliente: {
        tipo_cliente: f.cliente?.tipo_cliente || 'individual',
        preferencia_contacto: f.cliente?.preferencia_contacto || null,
        origen_registro: 'web'
      }
    };

    if (this.cliente) {
      // modo edición
      this.clientService.update(this.cliente.id, payload).subscribe(() => {
        Swal.fire('Actualizado', 'Cliente actualizado correctamente', 'success');
        this.clienteRegistrado.emit(this.cliente!);

      });
    } else {
      // modo creación
      this.clientService.create(payload).subscribe((clienteCreado) => {
        Swal.fire('Creado', 'Cliente creado correctamente', 'success');
        this.clienteRegistrado.emit(clienteCreado);
      });
    }
  }

  closeDialog() {
    this.cerrar.emit(); // notifica al padre que cierre el diálogo
  }
}
