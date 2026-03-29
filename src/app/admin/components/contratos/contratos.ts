import { ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ContratosInterface } from '../../interfaces/contratos-interface';
import { ContratosService } from '../../services/contratos-service';
import { MessageService, MenuItem } from 'primeng/api';
import { PrimengModule } from '../../../primeng/primeng-module';
import { UbicacionInterface } from '../../interfaces/ubicacion-interface';
import { GoogleMapsModule } from '@angular/google-maps';
import { UbicacionService } from '../../services/ubicacion-service';
import { ClientService } from '../../services/cliente-service';
import { EventosService } from '../../services/eventos-service';
import { Clientes } from '../clientes/clientes';
import { ClientesForm } from '../clientes/form/clientes-form';
import { ClientInterface } from '../../interfaces/cliente-interface';
import { EventosInterface } from '../../interfaces/eventos-interface';
import { EventosForm } from '../eventos/events/form/eventos-form';
import { CategoriaEventosInterface } from '../../interfaces/categoria-eventos-interface';
import { CategoriaEventosService } from '../../services/categoria-eventos-service';

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
    EventosForm
  ],
  providers: [MessageService]
})
export class Contratos implements OnInit {



@ViewChild(EventosForm) eventoFormComponent!: EventosForm;
@ViewChild(ClientesForm) clienteFormComponent!: ClientesForm;



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

  bloques = [
    { label: 'Mañana', value: 'mañana' },
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





  ngOnInit(): void {
    this.loadContratos();
    this.initForm();
    this.initMenu();
    this.listarclientes();
    this.listareventos();
    this.cargarCategorias();


  }

  // ---------------- Formulario ----------------
  initForm() {
    this.contratoForm = this.fb.group({
      cliente: [null, Validators.required],
      cliente_obj: [null, Validators.required],
      evento: [null, Validators.required],
      evento_obj: [null, Validators.required],
      ubicacion_nombre: ['', Validators.required],
      ubicacion_direccion: ['', Validators.required],
      latitud: [null, Validators.required],
      longitud: [null, Validators.required],
      fecha_evento: [null, Validators.required],
      bloque: [null, Validators.required],
      hora_inicio: [null, Validators.required],
      horas_contratadas: [1, [Validators.required, Validators.min(1)]],
      hora_fin: [{ value: '', disabled: true }],
      tipo_servicio: [null, Validators.required]
    });
  }

  // ---------------- Cargar contratos ----------------
  loadContratos() {
    this.contratoService.getContratos().subscribe({
      next: (data: ContratosInterface[]) => {
        this.contratos = data;
        this.cd.detectChanges();
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
      const contrato = this.contratoForm.getRawValue();
      this.contratoService.crearContrato(contrato).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Contrato creado correctamente' });
          this.displayDialog = false;
          this.loadContratos();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el contrato' });
        }
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Validación', detail: 'Completa todos los campos requeridos' });
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
    console.log('Detalle contrato', contrato);
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
  });
}
  onEventoSelect(event: any) {
  const evento = event.value;

  this.contratoForm.patchValue({
    evento: evento.id,        // ✅ backend
    evento_obj: evento        // ✅ UI
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

      const localidad = result.address_components.find((comp: any) =>
        comp.types.includes('locality') || comp.types.includes('sublocality')
      );

      this.ubicacion.nombre = localidad
        ? localidad.long_name
        : 'Ubicación seleccionada';

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


async usarMiUbicacion() {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition((pos) => {
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

        const localidad = result.address_components.find((comp: any) =>
          comp.types.includes('locality') || comp.types.includes('sublocality')
        );
        this.ubicacion.nombre = localidad ? localidad.long_name : 'Mi ubicación';

        // 🔑 Forzar refresco inmediato
        this.cd.detectChanges();
      } catch (error) {
        console.error('Error geocoder:', error);
      }
    });
  });
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
        }
      });
  }
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
}