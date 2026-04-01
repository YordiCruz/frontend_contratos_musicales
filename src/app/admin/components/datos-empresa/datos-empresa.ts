import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatosEmpresaService } from '../../services/datos-empresa-service';
import { DatosEmpresaInterface } from '../../interfaces/datos-empresa-interface';
import { PrimengModule } from '../../../primeng/primeng-module';
import { GoogleMapsModule } from '@angular/google-maps';
import Swal from 'sweetalert2';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-datos-empresa',
  imports: [PrimengModule, ReactiveFormsModule, GoogleMapsModule],
  templateUrl: './datos-empresa.html',
  styleUrl: './datos-empresa.scss',
})
export class DatosEmpresa implements OnInit {
  empresaForm!: FormGroup;
  empresa?: DatosEmpresaInterface;
  displayEmpresaDialog = false;

  zoom = 13;
  center = { lat: -17.4, lng: -66.2 }; // valor inicial
  markerPosition: { lat: number, lng: number } | null = null;

  constructor(
    private fb: FormBuilder,
    private empresaService: DatosEmpresaService,
    private ngZone: NgZone,
    private cd: ChangeDetectorRef,
    private messageService: MessageService 
  ) {}

  ngOnInit() {

    this.cargarEmpresa();

    this.empresaForm = this.fb.group({
  nombre_empresa: ['', Validators.required],
  nombre_lugar: ['', Validators.required],
  propietario: ['', [
    Validators.required,
    Validators.pattern(/^[a-zA-Z\s]+$/) // solo letras y espacios
  ]],
  telefono: ['', [
    Validators.required,
    Validators.pattern(/^\d+$/) // solo números
  ]],
  email: ['', [Validators.required, Validators.email]],
  direccion: ['', Validators.required],
  ciudad: [''],
  latitud: [null, Validators.required],
  longitud: [null, Validators.required],
});



  }

geocoder = new google.maps.Geocoder();


mapOptions: google.maps.MapOptions = {
  zoom: 13,
  center: { lat: -17.4, lng: -66.2 },
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false
};


async usarMiUbicacion() {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(async (pos) => {
    this.ngZone.run(async () => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      this.center = { lat, lng };
      this.zoom = 15;
      this.markerPosition = { lat, lng };

      this.empresaForm.patchValue({ latitud: lat, longitud: lng });

      try {
        const result: any = await this.obtenerDireccion(lat, lng);
        this.empresaForm.patchValue({
          direccion: result.formatted_address,
          nombre_lugar: this.extraerLocalidad(result)
        });
      } catch (error) {
        console.error('Error geocoder:', error);
      }

        this.cd.detectChanges(); 
    });
  });
}


  cargarEmpresa() {
  this.empresaService.obtenerTodos().subscribe({
    next: (res) => {
      console.log('Respuesta backend:', res);

      if (Array.isArray(res) && res.length > 0) {
        this.empresa = {
          ...res[0],
          latitud: Number(res[0].latitud),
          longitud: Number(res[0].longitud)
        };
        this.cd.detectChanges(); // fuerza actualización de la vista
      } else {
        this.empresa = undefined;
      }
    },
    error: (err) => {
      console.error('Error cargando empresa', err);
    }
  });
}


 abrirDialogoEmpresa() {
  this.displayEmpresaDialog = true;
  if (this.empresa) {
    this.empresaForm.patchValue(this.empresa);

    // 👇 convertir a número
    const lat = Number(this.empresa.latitud);
    const lng = Number(this.empresa.longitud);

    this.markerPosition = { lat, lng };
    this.center = { lat, lng };
  }
}


 guardarEmpresa() {
  if (this.empresaForm.valid) {
    const datos = this.empresaForm.getRawValue();

    if (this.empresa) {
      // Actualizar
      this.empresaService.actualizar(this.empresa.id!, datos).subscribe({
        next: (res) => {
          this.empresa = {
            ...res,
            latitud: Number(res.latitud),
            longitud: Number(res.longitud)
          };
          this.displayEmpresaDialog = false;

          // Swal de éxito
          Swal.fire('Actualizado', 'Los datos de la empresa fueron actualizados correctamente', 'success');

          // Toast de éxito
          this.messageService.add({
            severity: 'success',
            summary: 'Empresa actualizada',
            detail: 'Los datos se guardaron correctamente'
          });
        },
         error: (err) => {
  const mensajes = Array.isArray(err?.error?.message) ? err.error.message.join(', ') : err?.error?.message;
  Swal.fire('Error', mensajes, 'error');
  this.messageService.add({
    severity: 'error',
    summary: 'Error de validación',
    detail: mensajes
  });
}

      });
    } else {
      // Crear
      this.empresaService.crear(datos).subscribe({
        next: (res) => {
          this.empresa = {
            ...res,
            latitud: Number(res.latitud),
            longitud: Number(res.longitud)
          };
          this.displayEmpresaDialog = false;

          // Swal de éxito
          Swal.fire('Creada', 'La empresa fue registrada correctamente', 'success');

          // Toast de éxito
          this.messageService.add({
            severity: 'success',
            summary: 'Empresa creada',
            detail: 'Los datos se guardaron correctamente'
          });
        },
       error: (err) => {
  const mensajes = Array.isArray(err?.error?.message) ? err.error.message.join(', ') : err?.error?.message;
  Swal.fire('Error', mensajes, 'error');
  this.messageService.add({
    severity: 'error',
    summary: 'Error de validación',
    detail: mensajes
  });
}

      });
    }
  }
}



async onMapClick(event: google.maps.MapMouseEvent) {
  if (!event.latLng) return;
  const lat = event.latLng.lat();
  const lng = event.latLng.lng();

  this.ngZone.run(async () => {
    this.markerPosition = { lat, lng };
    this.center = { lat, lng };

    this.empresaForm.patchValue({ latitud: lat, longitud: lng });

    try {
      const result: any = await this.obtenerDireccion(lat, lng);
      this.empresaForm.patchValue({
        direccion: result.formatted_address,
        nombre_lugar: this.extraerLocalidad(result)
      });
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

private extraerLocalidad(result: any): string {
  const localidad = result.address_components.find((comp: any) =>
    comp.types.includes('locality') || comp.types.includes('sublocality')
  );
  return localidad ? localidad.long_name : 'Mi ubicación';
}






}

