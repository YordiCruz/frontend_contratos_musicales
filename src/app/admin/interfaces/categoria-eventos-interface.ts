export interface CategoriaEventosInterface {
  id_categoria: string;
  nombre: string;
  descripcion?: string | null;
  estado: string;
  creado_por?: string | null;
  actualizado_por?: string | null;
  creado_en?: string | Date | null;
  actualizado_en?: string | Date | null;
  eliminado_en?: string | Date | null;
}