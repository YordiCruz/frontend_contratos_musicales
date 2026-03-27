import { IntegranteInterface } from './integrante-interface';

export interface ContratosIntegrante {
  id_contrato: string;
  id_integrante: string;
  integrante: IntegranteInterface;

  especialidad: string;          // snapshot del nombre
  compensacion_hora: number;
  horas_contratadas: number;
  estado: 'pendiente' | 'aceptado' | 'rechazado';

  creado_en: string;
}