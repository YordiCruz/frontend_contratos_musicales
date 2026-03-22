import { CategoriaEventosInterface } from "./categoria-eventos-interface";
import { MediaEventosInterface } from "./media-eventos-interface";

export interface EventosInterface {
  id_evento: string;
  id_categoria: string;
  categoria?: CategoriaEventosInterface;
  nombre: string;
  descripcion?: string | null;
  estado: 'planificado' | 'activo' | 'inactivo' | 'cancelado';
  precio_base: number;
  creado_en: string;

  media: MediaEventosInterface[];
}
