export interface MediaEventosInterface {
  id_media: string;
  id_evento: string;
  tipo: 'portada' | 'imagen' | 'video';
  url: string;
  descripcion?: string;
  orden?: number;
  visibilidad_publica: boolean;
  creado_en: string;
  actualizado_en: string;
  eliminado_en?: string;
}