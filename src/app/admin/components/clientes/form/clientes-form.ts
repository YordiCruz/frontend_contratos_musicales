import { Component, EventEmitter, Input, Output } from "@angular/core";
import { PrimengModule } from "../../../../primeng/primeng-module";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ClientInterface } from "../../../interfaces/cliente-interface";
import { ClientService } from "../../../services/cliente-service";
import Swal from "sweetalert2";
import { MessageService } from "primeng/api";

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  templateUrl: './clientes-form.html',
  imports: [PrimengModule, ReactiveFormsModule],
  providers:[MessageService]
})
export class ClientesForm {
  @Input() cliente: ClientInterface | null = null; // para modo edición
  @Output() clienteRegistrado = new EventEmitter<ClientInterface>();
  @Output() cerrar = new EventEmitter<void>(); // para notificar al padre que se cierre el diálogo

  @Input() usarSwal = true;


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

  constructor(private clientService: ClientService, private messageService: MessageService) {}

ngOnChanges() {
  if (this.cliente) {
    // modo edición
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
  } else {
    // modo creación → limpiar formulario
    this.resetform();
}


}

resetform(){
  this.formCliente.reset({
      persona: {
        nombre: '',
        apellido: '',
        documento_identidad: '',
        telefono: '',
        email: ''
      },
      cliente: {
        preferencia_contacto: null,
        tipo_cliente: 'individual'
      }
    });
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
      preferencia_contacto: f.cliente?.preferencia_contacto || null
    }
  };

  if (this.cliente) {
    // 🔹 MODO EDICIÓN
    this.clientService.update(this.cliente.id, payload).subscribe({
      next: (res: ClientInterface) => {
        Swal.fire('Actualizado', 'Cliente actualizado correctamente', 'success');
        this.clienteRegistrado.emit(res);
        console.log("payloadfinal", payload);
      },
      error: (err) => {
        console.error('Error backend:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.message || 'Error desconocido'
        });
      }
    });
  } else {
    // 🔹 MODO CREACIÓN
    this.clientService.create(payload).subscribe({
      next: (clienteCreado: ClientInterface) => {
        if (this.usarSwal) {
  Swal.fire('Creado', 'Cliente creado correctamente', 'success');
}
        this.clienteRegistrado.emit(clienteCreado);
      },
      error: (err) => {
        console.error('Error backend:', err);
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
    this.cerrar.emit(); // notifica al padre que cierre el diálogo
  }
}
