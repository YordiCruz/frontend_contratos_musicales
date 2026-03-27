export interface DisponibilidadEventoInterface {
  id: string;
  fecha: string;                 // ISO date
  bloque: 'mañana' | 'noche';
  estado: 'libre' | 'ocupado';
  contrato?: string | null;      // id del contrato que ocupa
}