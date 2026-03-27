import { ReemplazosInterface } from "./reemplazos-interface";

export interface ContratoReemplazo {
  id_contrato: string;
  id_reemplazo: string;
  reemplazo: ReemplazosInterface;

  especialidad: string;          // snapshot del nombre
  compensacion_hora: number;
  horas_contratadas: number;
  estado: 'pendiente' | 'aceptado' | 'rechazado';

  creado_en: string;
}