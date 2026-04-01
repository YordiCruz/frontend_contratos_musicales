export interface DatosEmpresaInterface {
  id?: string;
  nombre_empresa: string;
  nombre_lugar: string;
  propietario: string;
  telefono: string;
  email: string;
  direccion: string;
  ciudad?: string;
  latitud: number;
  longitud: number;
}