import { ChangeDetectorRef, Component, EventEmitter, NgZone, OnInit, Output, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ContratoConCalculos, ContratosInterface } from '../../interfaces/contratos-interface';
import { ContratosService } from '../../services/contratos-service';
import { MessageService, MenuItem } from 'primeng/api';
import { PrimengModule } from '../../../primeng/primeng-module';
import { UbicacionInterface } from '../../interfaces/ubicacion-interface';
import { UbicacionService } from '../../services/ubicacion-service';
import { ClientService } from '../../services/cliente-service';
import { EventosService } from '../../services/eventos-service';
import { ClientesForm } from '../clientes/form/clientes-form';
import { ClientInterface } from '../../interfaces/cliente-interface';
import { EventosInterface } from '../../interfaces/eventos-interface';
import { EventosForm } from '../eventos/events/form/eventos-form';
import { CategoriaEventosInterface } from '../../interfaces/categoria-eventos-interface';
import { CategoriaEventosService } from '../../services/categoria-eventos-service';
import { GoogleMapsModule } from '@angular/google-maps';
import { PagosInterface } from '../../interfaces/pagos-interface';
import { Popover } from 'primeng/popover';
import Swal from 'sweetalert2';
import { PagosForm } from '../pagos/form/pagos-form';

@Component({
  selector: 'app-contratos',
  templateUrl: './contratos.html',
  styleUrls: ['./contratos.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PrimengModule,
    FormsModule,
    GoogleMapsModule,
    ClientesForm,
    EventosForm,
    PagosForm
  ],
  providers: [MessageService]
})
export class Contratos implements OnInit {



@ViewChild(EventosForm) eventoFormComponent!: EventosForm;
@ViewChild(ClientesForm) clienteFormComponent!: ClientesForm;

contratoIdActual: string | null = null;


distancia = signal<number | null>(null);
  tiempo = signal<number | null>(null);
  recargo = signal<number | null>(null);
  montoTotalSignal = signal<number | null>(null);
  precioBase = signal<number | null>(null);


  cargarCalculo(idContrato: string) {
    this.contratoService.getCalculoContrato(idContrato).subscribe(data => {
      this.distancia.set(data.distancia_metros);
      this.tiempo.set(data.minutos);
      this.recargo.set(data.recargo);
      this.montoTotalSignal.set(data.monto_total);
      this.precioBase.set(data.precio_base);

       this.contratoForm.patchValue({
      monto_total: data.monto_total
    });
    });


  }


  calcularPreviewUbicacion() {
  if (!this.ubicacion.latitud || !this.ubicacion.longitud) return;

  this.contratoService.calcularPreview({
    lat: this.ubicacion.latitud,
    lng: this.ubicacion.longitud
  }).subscribe(data => {
    this.distancia.set(data.distancia_metros);
    this.tiempo.set(data.minutos);
    this.recargo.set(data.recargo);

    // 🔥 calcular total dinámico
    const precioBase = this.contratoForm.get('precio_base')?.value || 0;
    const horas = this.contratoForm.get('horas_contratadas')?.value || 0;

    const total = (precioBase * horas) + data.recargo;

    this.montoTotalSignal.set(total);

    this.contratoForm.patchValue({
      monto_total: total
    });
  });
}



  contratos: ContratosInterface[] = [];
  contratoForm!: FormGroup;

  displayDialog = false;
  displayClienteDialog = false;
  displayEventoDialog = false;
  displayUbicacionDialog = false;

  clientes: any[] = [];
  filteredClientes: any[] = [];
  eventos: any[] = [];
  filteredEventos: any[] = [];


  pagos?: PagosInterface[];

  bloques = [
    { label: 'Mañana', value: 'mañana' },
    { label: 'Tarde', value: 'tarde' },
    { label: 'Noche', value: 'noche' }
  ];

  tiposServicio = [
    { label: 'Mariachi', value: 'mariachi' },
    { label: 'Orquesta', value: 'orquesta' }
  ];

  // ---------------- Mapa Google ----------------
  zoom = 13;

  ubicacion: UbicacionInterface = { nombre: '', direccion: '', latitud: null, longitud: null };
  ubicaciones: UbicacionInterface[] = [];

  // ---------------- Menú localidades ----------------
  items: MenuItem[] | undefined;

  constructor(
    private contratoService: ContratosService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private messageService: MessageService,
    private ngZone: NgZone,
    private ubicacionService: UbicacionService,
    private clientsService: ClientService,
    private eventosService: EventosService,
    private categoriasService: CategoriaEventosService

  ) {}

mapOptions: google.maps.MapOptions = {
  zoom: 13,
  center: { lat: -17.4, lng: -66.2 },
  streetViewControl: false,   // 🔑 quita el pegman
  mapTypeControl: false,
  fullscreenControl: false
};

mapRef!: google.maps.Map;

onMapReady(map: google.maps.Map) {
  this.mapRef = map;
  console.log('Mapa listo ✅', map);
}


@ViewChild(PagosForm) pagosFormComponent!: PagosForm;

abrirPago(contrato: ContratosInterface) {
  this.selectedContrato = contrato;
  this.displayFormPago = true;   // 👈 esto abre el diálogo
}







  ngOnInit(): void {
    this.loadContratos();
    this.initForm();
    this.initMenu();
    this.listarclientes();
    this.listareventos();
    this.cargarCategorias();

    this.contratoForm.get('horas_contratadas')?.valueChanges.subscribe(() => {
  this.calcularDescuento();
  this.contratoForm.get('hora_inicio')?.updateValueAndValidity(); // 👈
});


  const hoy = new Date();
this.cargarDisponibilidad(hoy.getFullYear(), hoy.getMonth() + 1);


 // 👇 recalcular cuando cambian horas
  this.contratoForm.get('horas_contratadas')?.valueChanges.subscribe(() => {
    this.calcularDescuento();
    this.contratoForm.get('hora_inicio')?.updateValueAndValidity();
  });

  // 👇 recalcular cuando cambia el evento (precio_base)
  this.contratoForm.get('precio_base')?.valueChanges.subscribe(() => {
    this.calcularDescuento();
    this.calcularMontoTotal();
  });


  this.contratoForm.get('tipo_servicio')?.valueChanges.subscribe(() => {
  this.calcularMontoTotal();
});


  }

  // ---------------- Formulario ----------------
  initForm() {
    this.contratoForm = this.fb.group({
      cliente: [null, Validators.required],
      cliente_obj: [null, Validators.required],
      evento: [null, Validators.required],
      evento_obj: [null, Validators.required],
      precio_base: [{ value: 0, disabled: true }],   // 👈 readonly
      monto_total: [{ value: 0, disabled: true }], 
      ubicacion_nombre: ['', Validators.required],
      ubicacion_direccion: ['', Validators.required],
      latitud: [null, Validators.required],
      longitud: [null, Validators.required],
      fecha_evento: [null, Validators.required],
      bloque: [null, Validators.required],
      descuento: [{ value: 0, disabled: true }], 
      hora_inicio: [null, [this.horaMinValidator()]],
      horas_contratadas: [1, [Validators.required, Validators.min(1)]],
      hora_fin: [{ value: '', disabled: true }],
      tipo_servicio: [null, Validators.required],
      
    });
  }

  // ---------------- Cargar contratos ----------------
  loadContratos() {
    this.contratoService.getContratos().subscribe({
      next: (data: ContratosInterface[]) => {
        this.contratos = data;

        setTimeout(() => this.cd.detectChanges());

      },
      error: (err) => console.error('Error cargando contratos', err)
    });
  }

  getSeverity(estado: string) {
    switch (estado) {
      case 'confirmado': return 'success';
      case 'pendiente': return 'warn';
      case 'cancelado': return 'danger';
      default: return 'secondary';
    }
  }

  // ---------------- Crear/Cancelar contratos ----------------
  openCreate() {
    this.displayDialog = true;
    this.contratoForm.reset();
  }

  
  crearContrato() {
  if (this.contratoForm.valid) {
    const raw = this.contratoForm.getRawValue();

    const horaInicioDate = new Date(raw.hora_inicio);
    const horaInicioStr = `${String(horaInicioDate.getHours()).padStart(2, '0')}:${String(horaInicioDate.getMinutes()).padStart(2, '0')}:00`;

    const horaFinDate = new Date(raw.hora_inicio);
    horaFinDate.setHours(horaFinDate.getHours() + Number(raw.horas_contratadas));
    const horaFinStr = `${String(horaFinDate.getHours()).padStart(2, '0')}:${String(horaFinDate.getMinutes()).padStart(2, '0')}:00`;

    const contrato = {
      id_cliente: raw.cliente,
      id_evento: raw.evento,
      id_ubicacion: this.ubicacionIdActual,
      fecha_evento: raw.fecha_evento,
      bloque: raw.bloque,
      hora_inicio: horaInicioStr,
      hora_fin: horaFinStr,
      tipo_servicio: raw.tipo_servicio,
      horas_contratadas: raw.horas_contratadas,
      descuento: raw.descuento,
      monto_total: raw.monto_total
    };

    this.contratoService.crearContrato(contrato).subscribe({
      next: (nuevoContrato) => {
        // Combinar datos reales con cálculos
        const contratoConCalculos: ContratoConCalculos = {
          ...nuevoContrato,
          monto_total: raw.monto_total,
          descuento: raw.descuento,
          horas_contratadas: raw.horas_contratadas,
          precio_base: raw.precio_base,
          recargo: this.recargo()
        };

       Swal.fire({
  icon: 'info',
  title: 'Contrato creado',
  text: 'Debe realizar el pago o dar un adelanto para confirmar el contrato',
  confirmButtonText: 'Registrar Pago'
}).then(result => {
  if (result.isConfirmed) {
    // Ejecutar dentro de Angular zone para que se detecten los cambios
    this.ngZone.run(() => {
      this.selectedContrato = contratoConCalculos;
      this.displayFormPago = true;
      // Forzar CD para asegurar que el hijo reciba los @Input inmediatamente
      this.cd.detectChanges();
    });
  }
});



        this.displayDialog = false;
        this.loadContratos();
      },
      error: (err) => {
        console.error('error:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo crear el contrato'
        });
      }
    });
  } else {
    this.messageService.add({
      severity: 'warn',
      summary: 'Validación',
      detail: 'Completa todos los campos requeridos'
    });
  }
}




  confirmarContrato(contrato: ContratosInterface) {
    this.contratoService.confirmarContrato(contrato.id_contrato).subscribe(() => {
      this.loadContratos();
    });
  }

  cancelarContrato(contrato: ContratosInterface) {
    this.contratoService.cancelarContrato(contrato.id_contrato).subscribe(() => {
      this.loadContratos();
    });
  }

 openDetail(contrato: ContratosInterface) {
  this.contratoIdActual = contrato.id_contrato;  // 👈 NECESARIO
  this.cargarCalculo(contrato.id_contrato);
}

  // ---------------- Clientes y eventos ----------------
buscarCliente(event: any) {
  const query = String(event.query).toLowerCase();

  this.filteredClientes = this.clientes.filter(c =>
    String(c.persona.documento_identidad).toLowerCase().includes(query)
  );
}



onClienteSelect(event: any) {
  const cliente = event.value;

  this.contratoForm.patchValue({
    cliente: cliente.id,        // ✅ backend
    cliente_obj: cliente        // ✅ UI
  });
}


listarclientes() {
  this.clientsService.listar().subscribe({
    next: (data) => {
      this.clientes = data.map(c => ({
        ...c,
        displayLabel: `${c.persona.documento_identidad} - ${c.persona.nombre} ${c.persona.apellido}`
      }));
    }
  });
}


onClienteRegistrado(cliente: ClientInterface) {
  this.displayClienteDialog = false; // cerrar el diálogo de cliente

  this.clienteFormComponent?.resetform();


  // ✅ Toast de éxito
  this.messageService.add({
    severity: 'success',
    summary: 'Cliente creado',
    detail: 'El cliente fue registrado correctamente'
  });

   const clienteConLabel = {
    ...cliente,
    displayLabel: `${cliente.persona.documento_identidad} - ${cliente.persona.nombre} ${cliente.persona.apellido}`
  };


  // aquí puedes también setear el cliente en el contrato
  this.contratoForm.patchValue({ cliente_obj: clienteConLabel });
}






  buscarEvento(event: any) {
     const query = String(event.query).toLowerCase();

  this.filteredEventos = this.eventos.filter(e =>
    String(e.nombre).toLowerCase().includes(query)
  );
  }

  categorias: CategoriaEventosInterface[] = [];



cargarCategorias() {
  this.categoriasService.listar().subscribe(res => {
    this.categorias = res.map(c => ({
      ...c,
      id_categoria: String(c.id_categoria)
    }));

    this.cd.detectChanges(); // 🔥 después de asignar
  });
}



  onEventoSelect(event: any) {
  const evento = event.value;

  console.log('evento seleccionado:', evento); 


  this.contratoForm.patchValue({
    evento: evento.id_evento,        // ✅ backend
    evento_obj: evento,        // ✅ UI
 precio_base: evento.precio_base
  });

  const horas = this.contratoForm.get('horas_contratadas')?.value || 0;
  this.contratoForm.patchValue({
    monto_total: evento.precio_base * horas
  });

}


onHorasChange() {
  this.calcularPreviewUbicacion();
  
  const precioBase = this.contratoForm.get('precio_base')?.value || 0;
  const horas = this.contratoForm.get('horas_contratadas')?.value || 0;
  this.contratoForm.patchValue({
    monto_total: precioBase * horas
  });
}


  listareventos() {
  this.eventosService.listar().subscribe({
    next: (data) => {
      this.eventos = data.map(c => ({
        ...c,
        displayLabel: `${c.nombre}`
      }));
    }
  });
}


onEventoRegistrado(evento: EventosInterface) {
  this.displayEventoDialog = false; // cerrar el diálogo de cliente

  this.eventoFormComponent?.resetForm();

  // ✅ Toast de éxito
  this.messageService.add({
    severity: 'success',
    summary: 'Evento creado',
    detail: 'El Evento fue registrado correctamente'
  });

   const eventoConLabel = {
    ...evento,
    displayLabel: `${evento.nombre}`
  };


  // aquí puedes también setear el cliente en el contrato
  this.contratoForm.patchValue({ evento_obj: eventoConLabel });
}



  // ---------------- Hora fin ----------------
  calcularHoraFin() {
    const horaInicio: Date = this.contratoForm.get('hora_inicio')?.value;
    const horas = this.contratoForm.get('horas_contratadas')?.value;
    if (horaInicio && horas) {
      const horaFin = new Date(horaInicio);
      horaFin.setHours(horaFin.getHours() + horas);
      this.contratoForm.patchValue({ hora_fin: horaFin.toLocaleTimeString() });
    }
  }

  openClienteDialog() { this.displayClienteDialog = true; }
  openEventoDialog() { this.displayEventoDialog = true; }

  // ---------------- Ubicaciones ----------------
openUbicacionDialog() {
  this.displayUbicacionDialog = true;

  setTimeout(() => {
    if (this.mapRef) {
      google.maps.event.trigger(this.mapRef, 'resize');
      if (this.markerPosition) {
        this.mapRef.setCenter(this.markerPosition);
      } else {
        this.mapRef.setCenter(this.center);
      }
    }
  }, 300);
}


//   onMapReady(event: any) {
//   const map = event as google.maps.Map;
//   console.log('Mapa listo', map);
// }






markerPosition: { lat: number, lng: number } | null = null;
center: { lat: number, lng: number } = { lat: -17.4, lng: -66.2 };

geocoder = new google.maps.Geocoder();

async onMapClick(event: google.maps.MapMouseEvent) {
  if (!event.latLng) return;

  const lat = event.latLng.lat();
  const lng = event.latLng.lng();

  this.ngZone.run(async () => {
    this.markerPosition = { lat, lng };
    this.center = { lat, lng };
    this.ubicacion.latitud = lat;
    this.ubicacion.longitud = lng;

    try {
      const result: any = await this.obtenerDireccion(lat, lng);
      this.ubicacion.direccion = result.formatted_address;
      this.ubicacion.nombre = this.obtenerNombreLugar(result.address_components);
      this.ubicacion = { ...this.ubicacion };
      this.cd.detectChanges();
    } catch (error) {
      console.error('Error geocoder:', error);
    }
  });
}



private obtenerDireccion(lat: number, lng: number): Promise<any> {
  return new Promise((resolve, reject) => {
    this.geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results?.length) {
        resolve(results[0]);
      } else {
        reject(status);
      }
    });
  });
}


cargandoUbicacion = false;

async usarMiUbicacion() {
  if (!navigator.geolocation) {
    this.messageService.add({ severity: 'warn', summary: 'GPS no disponible', detail: 'Tu navegador no soporta geolocalización' });
    return;
  }

  this.cargandoUbicacion = true;

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      this.ngZone.run(async () => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        this.center = { lat, lng };
        this.zoom = 15;
        this.markerPosition = { lat, lng };
        this.ubicacion.latitud = lat;
        this.ubicacion.longitud = lng;

        try {
          const result: any = await this.obtenerDireccion(lat, lng);
          this.ubicacion.direccion = result.formatted_address;
          this.ubicacion.nombre = this.obtenerNombreLugar(result.address_components);
          this.cd.detectChanges();
        } catch (error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo obtener la dirección' });
        } finally {
          this.cargandoUbicacion = false;
          this.cd.detectChanges();
        }
      });
    },
    (error) => {
      this.cargandoUbicacion = false;
      this.messageService.add({ severity: 'error', summary: 'Error GPS', detail: 'No se pudo obtener tu ubicación' });
    },
    { timeout: 10000, enableHighAccuracy: true }
  );
}



tieneUbicacion = false;
ubicacionIdActual: string | null | undefined = null;

seleccionarUbicacion() {
  // 🔥 SI YA EXISTE → ACTUALIZAR
  if (this.ubicacionIdActual) {
    this.ubicacionService.actualizarUbicacion(this.ubicacionIdActual, this.ubicacion)
      .subscribe({
        next: (ubiActualizada) => {
          this.contratoForm.patchValue({
            ubicacion_id: ubiActualizada.id_ubicacion,
            ubicacion_nombre: ubiActualizada.nombre,
            ubicacion_direccion: ubiActualizada.direccion,
            latitud: ubiActualizada.latitud,
            longitud: ubiActualizada.longitud
          });

          this.displayUbicacionDialog = false;
          this.cd.detectChanges();

     this.calcularPreviewUbicacion();


        }
      });
  }
  // 🔥 SI NO EXISTE → CREAR
  else {
    this.ubicacionService.crearUbicacion(this.ubicacion)
      .subscribe({
        next: (ubiCreada) => {
          this.ubicacionIdActual = ubiCreada.id_ubicacion; // 🔑 guardas el ID

          this.contratoForm.patchValue({
            ubicacion_id: ubiCreada.id_ubicacion,
            ubicacion_nombre: ubiCreada.nombre,
            ubicacion_direccion: ubiCreada.direccion,
            latitud: ubiCreada.latitud,
            longitud: ubiCreada.longitud
          });

          this.tieneUbicacion = true;
          this.displayUbicacionDialog = false;
          this.cd.detectChanges();

              this.calcularPreviewUbicacion();


        }
      });
  }
}

selectedContrato?: ContratosInterface;
  displayFormPago = false;
  // Datos calculados en el form, para pasarlos al pago
  descuentoPendiente = 0;
  montoFinalPendiente = 0;

 contratoGuardado(event: { contrato: ContratosInterface, descuento: number, montoFinal: number }) {
  this.selectedContrato   = event.contrato;
  this.descuentoPendiente = event.descuento;
  this.montoFinalPendiente = event.montoFinal;

  Swal.fire({
    icon: 'success',
    title: '¡Contrato creado!',
    text: 'Para confirmar el contrato debe dar un adelanto o cancelar el monto completo.',
    confirmButtonText: 'Registrar pago',
    showCancelButton: true,
    cancelButtonText: 'Ahora no',
  }).then((result) => {
    if (result.isConfirmed) {
       this.displayFormPago = true;
    }
  });
}


  @Output() guardado = new EventEmitter<{
  contrato: ContratosInterface,
  descuento: number,
  montoFinal: number
}>();


pagoGuardado(pago: PagosInterface) {
  this.messageService.add({
    severity: 'success',
    summary: 'Pago registrado',
    detail: 'El pago se guardó correctamente'
  });
  this.displayFormPago = false;
  this.loadContratos(); // refrescar lista
}


get montoTotal(): number {
  const precio = Number(this.contratoForm.get('precio_base')?.value ?? 0);
  const horas  = Number(this.contratoForm.get('horas_contratadas')?.value ?? 0);
  return +(precio * horas).toFixed(2);
}

get montoFinal(): number {
  const descuento = Number(this.contratoForm.get('descuento')?.value ?? 0);
  return +(this.montoTotal * (1 - descuento / 100)).toFixed(2);
}

onSubmit() {
  if (this.contratoForm.invalid) return;

  // Solo mandas al backend lo que le pertenece al contrato
  this.contratoService.crearContrato(this.contratoForm.value).subscribe({
    next: (contrato: ContratosInterface) => {
      this.guardado.emit({
        contrato,
        descuento: Number(this.contratoForm.get('descuento')?.value ?? 0),
        montoFinal: this.montoFinal,
      });
    },
    error: () => { /* manejo de error */ }
  });
}

abrirFormularioPago(contrato: ContratosInterface) {
  this.selectedContrato = contrato;
  this.displayFormPago = true;
}

  guardarUbicacion() {
    this.ubicaciones.push({ ...this.ubicacion });
    this.ubicacion = { nombre: '', direccion: '', latitud: null, longitud: null };
  }

  eliminarUbicacion(ubi: any) {
    this.ubicaciones = this.ubicaciones.filter(u => u !== ubi);
  }

  // ---------------- Menú localidades ----------------
  initMenu() {
    this.items = [
      {
        label: 'Villa Tunari',
        icon: 'pi pi-map',
        items: [
          { label: 'Eterazama', icon: 'pi pi-circle' },
          { label: 'San Gabriel', icon: 'pi pi-circle' },
          { label: 'Isinuta', icon: 'pi pi-circle' },
          { label: 'Paracti', icon: 'pi pi-circle' }
        ]
      },
      {
        label: 'Chimore',
        icon: 'pi pi-map',
        items: [
          { label: 'Senda 3', icon: 'pi pi-circle' },
          { label: 'Senda 4', icon: 'pi pi-circle' },
          { label: 'Puerto Aurora', icon: 'pi pi-circle' }
        ]
      },
      {
        label: 'Ivirgarzama',
        icon: 'pi pi-map',
        items: [
          { label: 'Villa Porvenir', icon: 'pi pi-circle' },
          { label: 'Samuzabety', icon: 'pi pi-circle' }
        ]
      },
      {
        label: 'Entre Ríos',
        icon: 'pi pi-map',
        items: [
          { label: 'Centro Entre Ríos', icon: 'pi pi-circle' }
        ]
      },
      {
        label: 'Bulo Bulo',
        icon: 'pi pi-map',
        items: [
          { label: 'Aeropuerto Bulo Bulo', icon: 'pi pi-circle' },
          { label: 'Centro Bulo Bulo', icon: 'pi pi-circle' }
        ]
      }
    ];
  }



  // descuento

calcularDescuento() {
  const horas = Number(this.contratoForm.get('horas_contratadas')?.value) || 0;
  let descuento = 0;

  if (horas >= 2 && horas <= 3) descuento = 10;
  else if (horas >= 4) descuento = 15;

  // 👇 getRawValue() para leer campos disabled
  const raw = this.contratoForm.getRawValue();
  const precioBase = raw.precio_base || 0;
  const recargo = this.recargo() || 0;
  const totalSinDescuento = precioBase * horas + recargo;
  const totalConDescuento = totalSinDescuento * (1 - descuento / 100);

  
  this.contratoForm.patchValue({
    descuento: descuento,
    monto_total: totalConDescuento
  });

  this.calcularMontoTotal(descuento);


}


fechaMinima: Date = new Date();

horaMinima: Date = new Date();

actualizarHoraMinima() {
  this.overlayFecha.hide();

  const fechaEvento: Date = this.contratoForm.get('fecha_evento')?.value || new Date();
  const ahora = new Date();

  if (
    fechaEvento.getFullYear() === ahora.getFullYear() &&
    fechaEvento.getMonth() === ahora.getMonth() &&
    fechaEvento.getDate() === ahora.getDate()
  ) {
    this.horaMinima = ahora;
  } else {
    this.horaMinima = new Date(fechaEvento);
    this.horaMinima.setHours(0, 0, 0, 0);
  }

  // 👇 cargar horarios ocupados del día seleccionado
  const mes = String(fechaEvento.getMonth() + 1).padStart(2, '0');
  const dia = String(fechaEvento.getDate()).padStart(2, '0');
  const key = `${fechaEvento.getFullYear()}-${mes}-${dia}`;
  this.cargarHorariosOcupados(key);

  this.contratoForm.get('hora_inicio')?.updateValueAndValidity();
}

horaMinValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor: Date = control.value;
    if (!valor) return null;

    const ahora = new Date();
    const fechaEvento: Date = this.contratoForm.get('fecha_evento')?.value || ahora;
    const esHoy =
      fechaEvento.getFullYear() === ahora.getFullYear() &&
      fechaEvento.getMonth() === ahora.getMonth() &&
      fechaEvento.getDate() === ahora.getDate();

    // Validación hora mínima
    if (esHoy) {
      const limiteMinutos = ahora.getHours() * 60 + ahora.getMinutes();
      const seleccionMinutos = valor.getHours() * 60 + valor.getMinutes();
      if (seleccionMinutos < limiteMinutos) {
        return { horaInvalida: true };
      }
    }

    // Validación solapamiento
    const horas = Number(this.contratoForm?.get('horas_contratadas')?.value) || 1;
    const inicioNuevo = valor.getHours() * 60 + valor.getMinutes();
    const finNuevo = inicioNuevo + horas * 60;

    for (const horario of this.horariosOcupados) {
      if (!horario.hora_inicio || !horario.hora_fin) continue;

      const [hIni, mIni] = horario.hora_inicio.split(':').map(Number);
      const [hFin, mFin] = horario.hora_fin.split(':').map(Number);
      const inicioExistente = hIni * 60 + mIni;
      const finExistente = hFin * 60 + mFin;

      // hay solapamiento si los rangos se intersectan
      if (inicioNuevo < finExistente && finNuevo >= inicioExistente) {
  return { 
    horarioSolapado: `Conflicto con contrato de ${horario.hora_inicio} a ${horario.hora_fin}`
  };
}
    }

    return null;
  };
}

disponibilidadMes: Map<string, 'completo' | 'parcial'> = new Map();
detalleMes: Map<string, string[]> = new Map();

cargarDisponibilidad(año: number, mes: number) {
  this.contratoService.getDisponibilidadPorMes(año, mes).subscribe(slots => {
    const conteo = new Map<string, number>();
    const bloques = new Map<string, string[]>();

    slots.forEach(slot => {
      if (slot.estado === 'ocupado') {
        const key = slot.fecha.split('T')[0];
        conteo.set(key, (conteo.get(key) || 0) + 1);
        bloques.set(key, [...(bloques.get(key) || []), slot.bloque]);
      }
    });

    this.disponibilidadMes = new Map();
    this.detalleMes = new Map();

    conteo.forEach((cantidad, fecha) => {
      this.disponibilidadMes.set(fecha, cantidad >= 3 ? 'completo' : 'parcial');
      this.detalleMes.set(fecha, bloques.get(fecha) || []); // 👈 guarda array directo
    });

    setTimeout(() => this.cd.detectChanges());
  });
}

onMesNavegado(event: any) {
  const fecha: Date = event.month ? 
    new Date(event.year, event.month - 1, 1) : 
    new Date(event);
  this.cargarDisponibilidad(fecha.getFullYear(), fecha.getMonth() + 1);
}

getEstadoFecha(date: any): 'completo' | 'parcial' | null {
  const mes = String(date.month + 1).padStart(2, '0'); // 👈 +1
  const dia = String(date.day).padStart(2, '0');
  const key = `${date.year}-${mes}-${dia}`;
  return this.disponibilidadMes.get(key) || null;
}


getTooltipFecha(date: any): string {
  const mes = String(date.month + 1).padStart(2, '0');
  const dia = String(date.day).padStart(2, '0');
  const key = `${date.year}-${mes}-${dia}`;
  const ocupados = this.detalleMes.get(key);

  if (!ocupados || ocupados.length === 0) return '';

  const todos = ['mañana', 'tarde', 'noche'];
  const libres = todos.filter(b => !ocupados.includes(b));

  if (libres.length === 0) return 'No disponible';
  
  return `Disponible: ${libres.join(', ')}`;
}



@ViewChild('overlayFecha') overlayFecha!: Popover;
disponibilidadDia: any[] = [];
todosBloques = ['mañana', 'tarde', 'noche'];

onFechaHover(date: any, event: MouseEvent) {
  event.stopPropagation();
  const mes = String(date.month + 1).padStart(2, '0');
  const dia = String(date.day).padStart(2, '0');
  const key = `${date.year}-${mes}-${dia}`;

  const estado = this.disponibilidadMes.get(key);
  if (!estado) return;

  this.contratoService.getDisponibilidadPorDia(key).subscribe(slots => {
    this.disponibilidadDia = this.todosBloques.map(bloque => {
      const slot = slots.find((s: any) => s.bloque === bloque);
      return {
        bloque,
        estado: slot?.estado || 'libre',
        hora_inicio: slot?.contrato?.hora_inicio || null,
        hora_fin: slot?.contrato?.hora_fin || null,
      };
    });
    this.overlayFecha.show(event);
  });
}

onFechaLeave() {
  this.overlayFecha.hide();
}


private horariosOcupados: { hora_inicio: string; hora_fin: string }[] = [];

cargarHorariosOcupados(fecha: string) {
  this.contratoService.getDisponibilidadPorDia(fecha).subscribe(slots => {
    this.horariosOcupados = slots
      .filter((s: any) => s.estado === 'ocupado' && s.contrato)
      .map((s: any) => ({
        hora_inicio: s.contrato.hora_inicio,
        hora_fin: s.contrato.hora_fin
      }));

    // re-validar hora_inicio con los nuevos horarios
    this.contratoForm.get('hora_inicio')?.updateValueAndValidity();
  });
}



calcularMontoTotal(descuentoOverride?: number) {
  const raw = this.contratoForm.getRawValue();
  const precioBase = raw.precio_base || 0;
  const horas = raw.horas_contratadas !== null ? Number(raw.horas_contratadas) : 0;
  const recargo = this.recargo();
  const tipoServicio = raw.tipo_servicio || 'mariachi';

  if (!precioBase || horas <= 0 || recargo === null) return;

  const recargoServicio = this.recargosServicio[tipoServicio] || 0;
  const descuento = descuentoOverride !== undefined ? descuentoOverride : (raw.descuento || 0);
  const subtotal = (precioBase * horas) + recargo + recargoServicio;
  const total = subtotal * (1 - descuento / 100);

  this.contratoForm.patchValue({ monto_total: total });
  this.montoTotalSignal.set(total);
}


private obtenerNombreLugar(addressComponents: any[]): string {
  const tiposPrioridad = [
    'sublocality_level_2',
    'sublocality_level_1',
    'sublocality',
    'neighborhood',
    'locality',
    'administrative_area_level_3',
    'administrative_area_level_2'
  ];

  for (const tipo of tiposPrioridad) {
    const componente = addressComponents.find((comp: any) =>
      comp.types.includes(tipo)
    );
    if (componente) return componente.long_name;
  }

  return 'Ubicación seleccionada';
}


recargosServicio: Record<string, number> = {
  'mariachi': 0,
  'orquesta': 500 // el valor que definas con tu cliente
};


}