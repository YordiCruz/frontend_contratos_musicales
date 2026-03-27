export interface UbicacionInterface {
  id_ubicacion?: string;
  nombre: string;
  direccion: string;
  latitud: number | null;
  longitud: number | null;
}