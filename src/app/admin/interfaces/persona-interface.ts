export interface PersonaInterface {
  id: string;
  nombre: string;
  apellido: string;
  documento_identidad: string;
  telefono: string;
  email: string;
  estado: 'activo' | 'inactivo';
  creado_en?: string;
  actualizado_en?: string;
}