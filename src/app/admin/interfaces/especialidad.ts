export interface Especialidad {
  id: string;                     // viene como "id"
  nombre: string;
  descripcion?: string | null;
  estado: string;

  id_categoria?: string;          // útil para crear/editar

  categoria?: {
    id: string;                   // backend usa "id", NO "id_categoria"
    nombre: string;
    icono?: string | null;
    estado: string;
  } | null;

  creado_en: string;              // backend envía Date → frontend usa string
  actualizado_en: string;
}