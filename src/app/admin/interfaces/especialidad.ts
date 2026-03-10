export interface Especialidad {
  id_especialidad?: string;
  nombre: string;
  descripcion: string | null;
  nivel_dificultad: number;
  id_categoria?: string; // opcional
  categoria?: {
    id_categoria: string;
    nombre: string;
    descripcion: string;
    icono: string | null;
    creadoEn: string;
    actualizadoEn: string;
  };
}