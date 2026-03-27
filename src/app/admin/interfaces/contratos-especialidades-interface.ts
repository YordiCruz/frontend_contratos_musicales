import { EspecialidadInterface } from "./especialidad-interface";

export interface ContratoEspecialidad {
  id: string;
  especialidad: EspecialidadInterface;

  tipo_asignacion?: 'primario' | 'secundario' | null;
  requerido: boolean;
}